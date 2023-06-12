import {Club, GroupAggregates, UserAggregates} from 'lib-mongoose';
import getClubOrLeagueOrFanGroup from '../getter/getClubOrLeagueOrFanGroup';

export default async function (type: string, increment: number, data: any) {
  // types: sport, league, club, lockerRoom, channelGroup, channel
  if (type === 'supporters') {
    const [objectType, objectID] = data.group.split(':');
    // user
    await UserAggregates.increment(data.userID, {supports: increment});
    // locker room
    const lockerRoom = `LockerRoom:${data.lockerRoomID}`;
    await GroupAggregates.increment(lockerRoom, {supporters: increment});
    // Club/League/FanGroup
    await GroupAggregates.increment(data.group, {supporters: increment});
    // sport of club/league/fanGroup
    const sportID = (
      await getClubOrLeagueOrFanGroup(objectType, objectID, {sportIDs: 1})
    ).sportIDs[0];
    await GroupAggregates.increment(`Sport:${sportID}`, {
      supporters: increment,
    });
    // if club has league
    if (objectType === 'Club') {
      const club = await Club.findById(objectID, {leagueID: 1}).exec();
      if (club?.leagueID) {
        // league where channel group is
        await GroupAggregates.increment(`League:${club?.leagueID}`, {
          supporters: increment,
        });
      }
    }
  }
  if (type === 'leagues') {
    for (const sportID of data.sportIDs) {
      const group = `Sport:${sportID}`;
      await GroupAggregates.increment(group, {leagues: increment});
    }
  }
  if (type === 'fanGroups') {
    for (const sportID of data.sportIDs) {
      const group = `Sport:${sportID}`;
      await GroupAggregates.increment(group, {fanGroups: increment});
    }
  }
  if (type === 'inHouses') {
    for (const sportID of data.sportIDs) {
      const group = `Sport:${sportID}`;
      await GroupAggregates.increment(group, {inHouses: increment});
    }
  }
  if (type === 'clubs') {
    for (const sportID of data!.sportIDs) {
      const group = `Sport:${sportID}`;
      await GroupAggregates.increment(group, {clubs: increment});
    }
    if (data.leagueID) {
      const group = `League:${data.leagueID}`;
      await GroupAggregates.increment(group, {clubs: increment});
    }
  }
  if (type === 'channelGroups' || type === 'channels') {
    const fields: any = {};
    fields[type] = increment;
    const [objectType, objectID] = data.group.split(':');
    // locker room where channel group is
    await GroupAggregates.increment(`LockerRoom:${data.lockerRoomID}`, fields);
    // Club/League/FanGroup
    await GroupAggregates.increment(data.group, fields);
    const sportID = (
      await getClubOrLeagueOrFanGroup(objectType, objectID, {sportIDs: 1})
    ).sportIDs[0];
    // sport of club/league
    await GroupAggregates.increment(`Sport:${sportID}`, fields);
    if (objectType === 'Club') {
      const club = await Club.findById(objectID, {
        sportIDs: 1,
        leagueID: 1,
      }).exec();
      if (club?.leagueID) {
        // league where channel group is
        await GroupAggregates.increment(`League:${club?.leagueID}`, fields);
      }
    }
  }
}
