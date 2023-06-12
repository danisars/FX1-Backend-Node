import {GroupAggregates} from 'lib-mongoose';
import getChannelCount from '../getter/getChannelCount';
import transferCounts from './transferCounts';
import getChannelGroupCount from '../getter/getChannelGroupCount';
import getSupportersCount from '../getter/getSupportersCount';

export default async function (
  group: string,
  input: any,
  initialClubSportID: string,
  initialClubLeagueID?: string | null
) {
  const supportersCount = await getSupportersCount(group);
  if (initialClubSportID !== input?.sportIDs[0]) {
    await GroupAggregates.increment(`Sport:${initialClubSportID}`, {
      clubs: -1,
    });
    await GroupAggregates.increment(`Sport:${input?.sportIDs[0]}`, {
      clubs: 1,
    });
    // transfer supporter/channel group/channel count
    await transferCounts(
      group,
      'Sport',
      initialClubSportID!,
      input!.sportIDs[0]!
    );
  }

  if (initialClubLeagueID !== input?.leagueID) {
    if (initialClubLeagueID !== null) {
      // transfer clubs count of club
      await GroupAggregates.increment(`League:${initialClubLeagueID}`, {
        clubs: -1,
      });
      await GroupAggregates.increment(`League:${input?.leagueID}`, {
        clubs: 1,
      });
      // transfer supporter/channel group/channel count
      await transferCounts(
        group,
        'League',
        initialClubLeagueID!,
        input!.leagueID!
      );
    }
    if (initialClubLeagueID === null) {
      // add clubs count of league
      await GroupAggregates.increment(`League:${input?.leagueID}`, {
        clubs: 1,
      });
      // add channel group count
      const channelGroupCount = await getChannelGroupCount(group);
      if (channelGroupCount > 0) {
        await GroupAggregates.increment(`League:${input?.leagueID}`, {
          channelGroups: channelGroupCount,
        });
      }
      // add channel count
      const channelCount = await getChannelCount(group);
      if (channelCount > 0) {
        await GroupAggregates.increment(`League:${input?.leagueID}`, {
          channels: channelCount,
        });
      }
      // add supporters count of league
      if (supportersCount > 0) {
        await GroupAggregates.increment(`League:${input?.leagueID}`, {
          supporters: supportersCount,
        });
      }
    }
  }
}
