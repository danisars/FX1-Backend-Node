import {GroupAggregates} from 'lib-mongoose';
import getChannelCount from '../getter/getChannelCount';

export default async function (
  group: string,
  objectType: string,
  initialID: string,
  finalID: string
) {
  const channelCount = await getChannelCount(group);
  if (channelCount > 0) {
    await GroupAggregates.increment(`${objectType}:${initialID}`, {
      channels: -channelCount,
    });
    await GroupAggregates.increment(`${objectType}:${finalID}`, {
      channels: channelCount,
    });
  }
}
