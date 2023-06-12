import {Channel, ChannelGroup, ChannelGroupDocument} from 'lib-mongoose';
import {channelFilter, channelGroupFilter} from '../../utilities';

export default async function (group: string) {
  const channelGroupIDs = (
    await ChannelGroup.find({...channelGroupFilter, group}).exec()
  ).map((item: ChannelGroupDocument) => item.id);
  return await Channel.countDocuments({
    ...channelFilter,
    channelGroupID: {$in: channelGroupIDs},
  });
}
