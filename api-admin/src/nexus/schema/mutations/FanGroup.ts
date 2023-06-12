import {arg, mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import {
  GroupAggregates,
  FanGroup,
  LockerRoom,
  ChannelGroup,
} from 'lib-mongoose';
import stringToSlug from '../../../app/transform/stringToSlug';
import sportIDCheckers from '../../../app/checker/sportIDCheckers';
import createDefaultChannelGroupAndChannels from '../../../app/creator/createDefaultChannelGroupAndChannels';
import incrementGroupAggregates from '../../../app/creator/incrementGroupAggregates';
import createLockerRoom from '../../../app/creator/createLockerRoom';
import deleteLockerRoom from '../../../app/creator/deleteLockerRoom';
import transferCounts from '../../../app/creator/transferCounts';

interface IInputFanGroup {
  name: string;
  Avatar?: {objectID: string; objectType: string} | null | undefined;
  CoverPhoto?: {objectID: string; objectType: string} | null | undefined;
  sportIDs: string[];
}

async function implementation(
  type: string,
  input: IInputFanGroup | null,
  id: string | null
) {
  if (type === 'delete') {
    const checkChannelGroup = await ChannelGroup.find({
      group: `FanGroup:${id}`,
    }).exec();
    if (checkChannelGroup.length > 0) {
      throw new Error(
        `Can no longer delete fan group. It is referenced on the ffg: ChannelGroup: ${checkChannelGroup.length}.`
      );
    }
    // Delete FanGroup
    const result = await FanGroup.findByIdAndDelete(id).exec();
    if (result) {
      const group = `FanGroup:${id}`;
      // Decrement Group Aggregates
      // TODO: Decrement supporters count on both GroupAggregates and User Aggregates once flow is finalized
      await GroupAggregates.findOneAndDelete({group}).exec();
      await incrementGroupAggregates('leagues', -1, {
        sportIDs: result!.sportIDs,
      });
      // Delete locker room
      await deleteLockerRoom(group);
      // TODO: Delete channel group and channels ?
      // TODO: Delete Messages and User Roles ?
    }
    return result?.id;
  }

  const {sportIDs} = input!;
  await sportIDCheckers(sportIDs);
  if (type === 'create') {
    const name = input!.name;
    const slug = await stringToSlug(FanGroup, name, false, true);
    // Create FanGroup
    const result = await FanGroup.create({...input, slug});
    if (result) {
      // Increment Group Aggregates
      const group = `FanGroup:${result.id}`;
      await GroupAggregates.create({group});
      await incrementGroupAggregates('fanGroups', 1, {
        sportIDs,
      });
      // Create locker room
      const lockerRoomResult = await createLockerRoom(
        name,
        `FanGroup:${result.id}`
      );
      // Create default channel group and channels
      await createDefaultChannelGroupAndChannels(
        lockerRoomResult.id,
        `FanGroup:${result.id}`
      );
    }
    return result?.id;
  }
  if (type === 'edit') {
    const initialFanGroupSportID = (await FanGroup.findById(id).exec())
      ?.sportIDs[0];
    const initialFanGroupName = (await FanGroup.findById(id).exec())?.name;

    const result = await FanGroup.findByIdAndUpdate(id, {
      ...input,
      updatedAt: new Date().getTime(),
    }).exec();

    if (result) {
      if (initialFanGroupSportID !== input?.sportIDs[0]) {
        await GroupAggregates.increment(`Sport:${initialFanGroupSportID}`, {
          fanGroups: -1,
        });
        await GroupAggregates.increment(`Sport:${input?.sportIDs[0]}`, {
          fanGroups: 1,
        });
        // transfer supporter/channel group/channel count
        const group = `FanGroup:${id}`;
        await transferCounts(
          group,
          'Sport',
          initialFanGroupSportID!,
          input!.sportIDs[0]!
        );
      }
      if (initialFanGroupName !== input?.name) {
        await LockerRoom.findOneAndUpdate(
          {group: `FanGroup:${id}`},
          {name: input?.name}
        ).exec();
      }
    }
    return result?.id;
  }
  return null;
}

export const FanGroupMutations = mutationField(t => {
  t.nonNull.field('createFanGroup', {
    type: 'MutationResult',
    args: {
      input: arg({type: nonNull('InputFanGroup')}),
    },
    resolve: async (source, {input}) => {
      const result = await implementation('create', input, null);
      return new MutationResult('FanGroup', result);
    },
  });
  t.nonNull.field('editFanGroup', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
      input: arg({type: nonNull('InputFanGroup')}),
    },
    resolve: async (source, {id, input}) => {
      const result = await implementation('edit', input, id);
      return new MutationResult('FanGroup', result);
    },
  });
  t.nonNull.field('deleteFanGroup', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (source, {id}) => {
      const result = await implementation('delete', null, id);
      return new MutationResult('FanGroup', result);
    },
  });
});
