import {ChannelGroup} from 'lib-mongoose';
import {channelGroupFilter} from '../../utilities';

export default async function (group: string) {
  return await ChannelGroup.countDocuments({...channelGroupFilter, group});
}
