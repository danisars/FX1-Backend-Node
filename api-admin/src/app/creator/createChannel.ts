import {
  Channel,
  ChannelGroup,
  Club,
  FanGroup,
  GroupAggregates,
  InHouse,
  League,
} from 'lib-mongoose';
import stringToSlug from '../transform/stringToSlug';

/*
Channel Creation
1. Create the Channel doc.
2. If not successful, expect an error.
3. Else, continue with creating the Channel's GroupAggregate doc.
4. Then, increment the GroupAggregate (channels) of the LockerRoom/League/Club/Sports to which this Channel Group belongs to.
 */
export interface IInputCreateChannel {
  name: string;
  description?: string | null | undefined;
  channelGroupID: string;
  type: string;
  livestreamID?: string | null | undefined;
}

export default async function (
  input: IInputCreateChannel,
  lockerRoomID: string
) {
  const name = input!.name;

  // 1. Create the Channel doc.
  const slug = await stringToSlug(Channel, name, false, true);
  // 2. If not successful, expect an error.
  const result = await Channel.create({...input, lockerRoomID, slug});
  // 3. Else, continue with creating the Channel's GroupAggregate doc.
  if (result) {
    // 4. Then, increment the GroupAggregate of the Locker Room to which this Channel Group belongs to.
    const lockerRoom = `LockerRoom:${lockerRoomID}`;
    await GroupAggregates.increment(lockerRoom, {channels: 1});

    const group = (await ChannelGroup.findById(result.channelGroupID).exec())
      ?.group;
    const [objectType, objectID] = group!.split(':');
    if (objectType === 'Club') {
      const clubRecord = await Club.findById(objectID).exec();
      // Increment Club
      await GroupAggregates.increment(group!, {channels: 1});
      // Increment Sport
      for (const sportID of clubRecord!.sportIDs) {
        const group = `Sport:${sportID}`;
        await GroupAggregates.increment(group, {channels: 1});
      }
      // Increment League
      if (clubRecord!.leagueID) {
        const group = `League:${clubRecord!.leagueID}`;
        await GroupAggregates.increment(group, {channels: 1});
      }
    }
    if (objectType === 'League') {
      const leagueRecord = await League.findById(objectID).exec();
      // Increment League
      await GroupAggregates.increment(group!, {channels: 1});
      // Increment Sport
      for (const sportID of leagueRecord!.sportIDs) {
        const group = `Sport:${sportID}`;
        await GroupAggregates.increment(group, {channels: 1});
      }
    }
    if (objectType === 'FanGroup') {
      const fanGroupRecord = await FanGroup.findById(objectID).exec();
      // Increment FanGroup
      await GroupAggregates.increment(group!, {channels: 1});
      // Increment Sport
      for (const sportID of fanGroupRecord!.sportIDs) {
        const group = `Sport:${sportID}`;
        await GroupAggregates.increment(group, {channels: 1});
      }
    }
    if (objectType === 'InHouse') {
      const inHouseRecord = await InHouse.findById(objectID).exec();
      // Increment InHouse
      await GroupAggregates.increment(group!, {channels: 1});
      // Increment Sport
      for (const sportID of inHouseRecord!.sportIDs) {
        const group = `Sport:${sportID}`;
        await GroupAggregates.increment(group, {channels: 1});
      }
    }
  }
  return result;
}
