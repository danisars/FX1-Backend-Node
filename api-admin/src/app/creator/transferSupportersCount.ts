import getSupportersCount from '../getter/getSupportersCount';
import {GroupAggregates} from 'lib-mongoose';

export default async function (
  group: string,
  objectType: string,
  initialID: string,
  finalID: string
) {
  const supportersCount = await getSupportersCount(group);
  if (supportersCount > 0) {
    await GroupAggregates.increment(`${objectType}:${initialID}`, {
      supporters: -supportersCount,
    });
    await GroupAggregates.increment(`${objectType}:${finalID}`, {
      supporters: supportersCount,
    });
  }
}
