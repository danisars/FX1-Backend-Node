import {GroupAggregates} from 'lib-mongoose';
import getChannelGroupCount from '../getter/getChannelGroupCount';

export default async function (
  group: string,
  objectType: string,
  initialID: string,
  finalID: string
) {
  const channelGroupCount = await getChannelGroupCount(group);
  if (channelGroupCount > 0) {
    await GroupAggregates.increment(`${objectType}:${initialID}`, {
      channelGroups: -channelGroupCount,
    });
    await GroupAggregates.increment(`${objectType}:${finalID}`, {
      channelGroups: channelGroupCount,
    });
  }
}
