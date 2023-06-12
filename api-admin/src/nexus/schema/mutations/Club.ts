import {arg, mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import {
  ChannelGroup,
  Club,
  GroupAggregates,
  LockerRoom,
  UserRole,
} from 'lib-mongoose';
import stringToSlug from '../../../app/transform/stringToSlug';
import leagueIDExists from '../../../app/checker/leagueIDExists';
import sportIDCheckers from '../../../app/checker/sportIDCheckers';
import createDefaultChannelGroupAndChannels from '../../../app/creator/createDefaultChannelGroupAndChannels';
import sportIDShouldMatchLeagueSportID from '../../../app/checker/sportIDShouldMatchLeagueSportID';
import incrementGroupAggregates from '../../../app/creator/incrementGroupAggregates';
import createLockerRoom from '../../../app/creator/createLockerRoom';
import deleteLockerRoom from '../../../app/creator/deleteLockerRoom';
import transferClubCount from '../../../app/creator/transferClubCount';

interface IInputClub {
  name: string;
  Avatar?: {objectID: string; objectType: string} | null | undefined;
  CoverPhoto?: {objectID: string; objectType: string} | null | undefined;
  sportIDs: string[];
  leagueID: string;
  isFeatured?: boolean | null | undefined;
}

async function implementation(
  type: string,
  input: IInputClub | null,
  id: string | null
) {
  if (type === 'delete') {
    const checkChannelGroup = await ChannelGroup.find({
      group: `Club:${id}`,
    }).exec();
    const checkUsers = await UserRole.find({
      group: `Club:${id}`,
      role: 'supporter',
    }).exec();
    if (checkChannelGroup.length > 0 || checkUsers.length > 0) {
      throw new Error(
        `Can no longer delete Club. It is referenced on the ffg: ChannelGroup: ${checkChannelGroup.length}, User: ${checkUsers.length}.`
      );
    }
    // Delete Club
    const result = await Club.findByIdAndDelete(id).exec();
    if (result) {
      const group = `Club:${id}`;
      // Decrement Group Aggregates
      await GroupAggregates.findOneAndDelete({group}).exec();
      await incrementGroupAggregates('clubs', -1, {
        sportIDs: result!.sportIDs,
        leagueID: result.leagueID,
      });
      // Delete locker room
      await deleteLockerRoom(group);
      // TODO: Delete channel group and channels ?
    }
    return id;
  }
  const {sportIDs, leagueID} = input as IInputClub;
  await sportIDCheckers(sportIDs);
  //check if leagueID exists, else throw error
  if (leagueID) {
    await leagueIDExists(leagueID);
    //check if inputted sports is the same as the declared sports league, else throw error
    await sportIDShouldMatchLeagueSportID(sportIDs, leagueID);
  }

  if (type === 'create') {
    const name = input!.name;
    const slug = await stringToSlug(Club, input!.name, false, true);
    // Create Club
    const result = await Club.create({...input, slug});
    if (result) {
      // Increment Group Aggregates
      const group = `Club:${result.id}`;
      await GroupAggregates.create({group});
      await incrementGroupAggregates('clubs', 1, {
        sportIDs: input!.sportIDs,
        leagueID: input!.leagueID,
      });
      // Create locker room
      const lockerRoomResult = await createLockerRoom(
        name,
        `Club:${result.id}`
      );
      // Create default channel group and channels
      await createDefaultChannelGroupAndChannels(lockerRoomResult.id, group);
    }
    return result.id;
  }
  if (type === 'edit') {
    const initialClubSportID = (await Club.findById(id).exec())?.sportIDs[0];
    const initialClubName = (await Club.findById(id).exec())?.name;
    const initialClubLeagueID = (await Club.findById(id).exec())?.leagueID;

    const result = await Club.findByIdAndUpdate(id, {
      ...input,
      updatedAt: new Date().getTime(),
    }).exec();

    if (result) {
      const group = `Club:${id}`;
      await transferClubCount(
        group,
        input,
        initialClubSportID!,
        initialClubLeagueID
      );

      if (initialClubName !== input?.name) {
        await LockerRoom.findOneAndUpdate(
          {group: `Club:${id}`},
          {name: input?.name}
        ).exec();
      }
    }
    return result?.id;
  }
  return null;
}

export const ClubMutations = mutationField(t => {
  t.nonNull.field('createClub', {
    type: 'MutationResult',
    args: {
      input: arg({type: nonNull('InputClub')}),
    },
    resolve: async (source, {input}) => {
      const result = await implementation('create', input, null);
      return new MutationResult('Club', result);
    },
  });
  t.nonNull.field('editClub', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
      input: arg({type: nonNull('InputClub')}),
    },
    resolve: async (source, {id, input}) => {
      const result = await implementation('edit', input, id);
      return new MutationResult('Club', result);
    },
  });
  t.nonNull.field('deleteClub', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (source, {id}) => {
      const result = await implementation('delete', null, id);
      return new MutationResult('Club', result);
    },
  });
});
