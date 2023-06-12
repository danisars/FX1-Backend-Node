import {arg, mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import {
  ChannelGroup,
  Club,
  ClubDocument,
  GroupAggregates,
  League,
  LockerRoom,
} from 'lib-mongoose';
import stringToSlug from '../../../app/transform/stringToSlug';
import sportIDCheckers from '../../../app/checker/sportIDCheckers';
import createDefaultChannelGroupAndChannels from '../../../app/creator/createDefaultChannelGroupAndChannels';
import incrementGroupAggregates from '../../../app/creator/incrementGroupAggregates';
import createLockerRoom from '../../../app/creator/createLockerRoom';
import deleteLockerRoom from '../../../app/creator/deleteLockerRoom';
import transferCounts from '../../../app/creator/transferCounts';
import transferClubCount from '../../../app/creator/transferClubCount';

interface IInputLeague {
  name: string;
  Avatar?: {objectID: string; objectType: string} | null | undefined;
  CoverPhoto?: {objectID: string; objectType: string} | null | undefined;
  sportIDs: string[];
}

async function implementation(
  type: string,
  input: IInputLeague | null,
  id: string | null
) {
  if (type === 'delete') {
    const checkChannelGroup = await ChannelGroup.find({
      group: `League:${id}`,
    }).exec();
    const checkClub = await Club.find({
      leagueID: id,
    }).exec();
    if (checkChannelGroup.length > 0 || checkClub.length > 0) {
      throw new Error(
        `Can no longer delete league. It is referenced on the ffg: ChannelGroup: ${checkChannelGroup.length}, Club: ${checkClub.length}.`
      );
    }
    // Delete League
    const result = await League.findByIdAndDelete(id).exec();
    if (result) {
      const group = `League:${id}`;
      // Decrement Group Aggregates
      await GroupAggregates.findOneAndDelete({group}).exec();
      await incrementGroupAggregates('leagues', -1, {
        sportIDs: result!.sportIDs,
      });
      // Delete locker room
      await deleteLockerRoom(group);
      // TODO: Delete channel group and channels ?
    }
    return result?.id;
  }

  const {sportIDs} = input!;
  await sportIDCheckers(sportIDs);
  if (type === 'create') {
    const name = input!.name;
    const slug = await stringToSlug(League, name, false, true);
    // Create League
    const result = await League.create({...input, slug});
    if (result) {
      // Increment Group Aggregates
      const group = `League:${result.id}`;
      await GroupAggregates.create({group});
      await incrementGroupAggregates('leagues', 1, {
        sportIDs,
      });
      // Create locker room
      const lockerRoomResult = await createLockerRoom(
        name,
        `League:${result.id}`
      );
      // Create default channel group and channels
      await createDefaultChannelGroupAndChannels(
        lockerRoomResult.id,
        `League:${result.id}`
      );
    }
    return result?.id;
  }
  if (type === 'edit') {
    const initialLeagueSportID = (await League.findById(id).exec())
      ?.sportIDs[0];
    const initialLeagueName = (await League.findById(id).exec())?.name;

    const result = await League.findByIdAndUpdate(id, {
      ...input,
      updatedAt: new Date().getTime(),
    }).exec();

    if (result) {
      if (initialLeagueSportID !== input?.sportIDs[0]) {
        await GroupAggregates.increment(`Sport:${initialLeagueSportID}`, {
          leagues: -1,
        });
        await GroupAggregates.increment(`Sport:${input?.sportIDs[0]}`, {
          leagues: 1,
        });
        // transfer supporter/channel group/channel count
        const group = `League:${id}`;
        await transferCounts(
          group,
          'Sport',
          initialLeagueSportID!,
          input!.sportIDs[0]!
        );
        // update the clubs under this league
        const clubGroupsUnderThisLeague = (
          await Club.find({leagueID: id}).exec()
        ).map((item: ClubDocument) => `Club:${item.id}`);
        for (const clubGroup of clubGroupsUnderThisLeague) {
          const group = clubGroup;
          const [, objectID] = group.split(':');
          const {name, Avatar, CoverPhoto, sportIDs, leagueID, isFeatured} =
            (await Club.findById(objectID).exec())!;
          await Club.findByIdAndUpdate(objectID, {
            sportIDs: input!.sportIDs!,
            updatedAt: new Date().getTime(),
          }).exec();
          await transferClubCount(
            group,
            {
              name,
              Avatar,
              CoverPhoto,
              sportIDs: input?.sportIDs,
              leagueID,
              isFeatured,
            },
            sportIDs[0],
            leagueID
          );
        }
      }
      if (initialLeagueName !== input?.name) {
        await LockerRoom.findOneAndUpdate(
          {group: `League:${id}`},
          {name: input?.name}
        ).exec();
      }
    }
    return result?.id;
  }
  return null;
}

export const LeagueMutations = mutationField(t => {
  t.nonNull.field('createLeague', {
    type: 'MutationResult',
    args: {
      input: arg({type: nonNull('InputLeague')}),
    },
    resolve: async (source, {input}) => {
      const result = await implementation('create', input, null);
      return new MutationResult('League', result);
    },
  });
  t.nonNull.field('editLeague', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
      input: arg({type: nonNull('InputLeague')}),
    },
    resolve: async (source, {id, input}) => {
      const result = await implementation('edit', input, id);
      return new MutationResult('League', result);
    },
  });
  t.nonNull.field('deleteLeague', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (source, {id}) => {
      const result = await implementation('delete', null, id);
      return new MutationResult('League', result);
    },
  });
});
