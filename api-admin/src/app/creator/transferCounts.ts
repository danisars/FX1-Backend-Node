import transferSupportersCount from './transferSupportersCount';
import transferChannelGroupCount from './transferChannelGroupCount';
import transferChannelCount from './transferChannelCount';

export default async function (
  group: string,
  objectType: string,
  initialID: string,
  finalID: string
) {
  // transfer supporters count
  await transferSupportersCount(group, objectType, initialID, finalID);
  // transfer channel group count
  await transferChannelGroupCount(group, objectType, initialID, finalID);
  // transfer channel count
  await transferChannelCount(group, objectType, initialID, finalID);
}
