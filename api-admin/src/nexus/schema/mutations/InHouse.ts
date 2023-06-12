import {arg, mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import {GroupAggregates, InHouse, LockerRoom, ChannelGroup} from 'lib-mongoose';
import stringToSlug from '../../../app/transform/stringToSlug';
import sportIDCheckers from '../../../app/checker/sportIDCheckers';
import createDefaultChannelGroupAndChannels from '../../../app/creator/createDefaultChannelGroupAndChannels';
import incrementGroupAggregates from '../../../app/creator/incrementGroupAggregates';
import createLockerRoom from '../../../app/creator/createLockerRoom';
import deleteLockerRoom from '../../../app/creator/deleteLockerRoom';
import transferCounts from '../../../app/creator/transferCounts';

interface IInputInHouse {
  name: string;
  Avatar?: {objectID: string; objectType: string} | null | undefined;
  CoverPhoto?: {objectID: string; objectType: string} | null | undefined;
  sportIDs: string[];
}

async function implementation(
  type: string,
  input: IInputInHouse | null,
  id: string | null
) {
  if (type === 'delete') {
    const checkChannelGroup = await ChannelGroup.find({
      group: `InHouse:${id}`,
    }).exec();
    if (checkChannelGroup.length > 0) {
      throw new Error(
        `Can no longer delete in house. It is referenced on the ffg: ChannelGroup: ${checkChannelGroup.length}.`
      );
    }
    // Delete InHouse
    const result = await InHouse.findByIdAndDelete(id).exec();
    if (result) {
      const group = `InHouse:${id}`;
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
    const slug = await stringToSlug(InHouse, name, false, true);
    // Create InHouse
    const result = await InHouse.create({...input, slug});
    if (result) {
      // Increment Group Aggregates
      const group = `InHouse:${result.id}`;
      await GroupAggregates.create({group});
      await incrementGroupAggregates('inHouses', 1, {
        sportIDs,
      });
      // Create locker room
      const lockerRoomResult = await createLockerRoom(
        name,
        `InHouse:${result.id}`
      );
      // Create default channel group and channels
      await createDefaultChannelGroupAndChannels(
        lockerRoomResult.id,
        `InHouse:${result.id}`
      );
    }
    return result?.id;
  }
  if (type === 'edit') {
    const initialInHouseSportID = (await InHouse.findById(id).exec())
      ?.sportIDs[0];
    const initialInHouseName = (await InHouse.findById(id).exec())?.name;

    const result = await InHouse.findByIdAndUpdate(id, {
      ...input,
      updatedAt: new Date().getTime(),
    }).exec();

    if (result) {
      if (initialInHouseSportID !== input?.sportIDs[0]) {
        await GroupAggregates.increment(`Sport:${initialInHouseSportID}`, {
          inHouses: -1,
        });
        await GroupAggregates.increment(`Sport:${input?.sportIDs[0]}`, {
          inHouses: 1,
        });
        // transfer supporter/channel group/channel count
        const group = `InHouse:${id}`;
        await transferCounts(
          group,
          'Sport',
          initialInHouseSportID!,
          input!.sportIDs[0]!
        );
      }
      if (initialInHouseName !== input?.name) {
        await LockerRoom.findOneAndUpdate(
          {group: `InHouse:${id}`},
          {name: input?.name}
        ).exec();
      }
    }
    return result?.id;
  }
  return null;
}

export const InHouseMutations = mutationField(t => {
  t.nonNull.field('createInHouse', {
    type: 'MutationResult',
    args: {
      input: arg({type: nonNull('InputInHouse')}),
    },
    resolve: async (source, {input}) => {
      const result = await implementation('create', input, null);
      return new MutationResult('InHouse', result);
    },
  });
  t.nonNull.field('editInHouse', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
      input: arg({type: nonNull('InputInHouse')}),
    },
    resolve: async (source, {id, input}) => {
      const result = await implementation('edit', input, id);
      return new MutationResult('InHouse', result);
    },
  });
  t.nonNull.field('deleteInHouse', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (source, {id}) => {
      const result = await implementation('delete', null, id);
      return new MutationResult('InHouse', result);
    },
  });
});
