import {
  ChannelGroup,
  Club,
  FanGroup,
  GroupAggregates,
  InHouse,
  League,
} from 'lib-mongoose';
import stringToSlug from '../transform/stringToSlug';

/*
Channel Group Creation
1. Create the Channel Group doc.
2. If not successful, expect an error.
4. Else, increment the GroupAggregate (channelGroups) of the LockerRoom/League/Club/Sports to which this Channel Group belongs to.
 */

export interface IInputCreateChannelGroup {
  name: string;
  description?: string | null | undefined;
  lockerRoomID: string;
  withLivestream?: boolean | null | undefined;
}

export default async function (input: IInputCreateChannelGroup, group: string) {
  const name = input!.name;
  const lockerRoomID = input!.lockerRoomID;
  // 1. Create the Channel Group doc.
  const slug = await stringToSlug(ChannelGroup, name, false, true);
  // 2. If not successful, expect an error.
  const result = await ChannelGroup.create({
    ...input,
    group,
    slug,
    lockerRoomID,
  });
  if (result) {
    // 3. Else, increment the GroupAggregate of the LockerRoom/League/Club/Sports to which this Channel Group belongs to.
    const lockerRoomGroup = `LockerRoom:${lockerRoomID}`;
    await GroupAggregates.increment(lockerRoomGroup, {channelGroups: 1});

    const [objectType, objectID] = result.group!.split(':');
    if (objectType === 'Club') {
      const clubRecord = await Club.findById(objectID).exec();
      // Increment Club
      await GroupAggregates.increment(result.group!, {channelGroups: 1});
      // Increment Sport
      for (const sportID of clubRecord!.sportIDs) {
        const group = `Sport:${sportID}`;
        await GroupAggregates.increment(group, {channelGroups: 1});
      }
      // Increment League
      if (clubRecord!.leagueID) {
        const group = `League:${clubRecord!.leagueID}`;
        await GroupAggregates.increment(group, {channelGroups: 1});
      }
    }
    if (objectType === 'League') {
      const leagueRecord = await League.findById(objectID).exec();
      // Increment League
      await GroupAggregates.increment(result.group!, {channelGroups: 1});
      // Increment Sport
      for (const sportID of leagueRecord!.sportIDs) {
        const group = `Sport:${sportID}`;
        await GroupAggregates.increment(group, {channelGroups: 1});
      }
    }
    if (objectType === 'FanGroup') {
      const fanGroupRecord = await FanGroup.findById(objectID).exec();
      // Increment FanGroup
      await GroupAggregates.increment(result.group!, {channelGroups: 1});
      // Increment Sport
      for (const sportID of fanGroupRecord!.sportIDs) {
        const group = `Sport:${sportID}`;
        await GroupAggregates.increment(group, {channelGroups: 1});
      }
    }
    if (objectType === 'InHouse') {
      const inHouseRecord = await InHouse.findById(objectID).exec();
      // Increment InHouse
      await GroupAggregates.increment(result.group!, {channelGroups: 1});
      // Increment Sport
      for (const sportID of inHouseRecord!.sportIDs) {
        const group = `Sport:${sportID}`;
        await GroupAggregates.increment(group, {channelGroups: 1});
      }
    }
  }
  return result;
}
