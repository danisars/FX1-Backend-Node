import {objectType} from 'nexus';
import livestreamIDExists from '../../../app/checker/livestreamIDExists';

export const Channel = objectType({
  name: 'Channel',
  definition(t) {
    t.id('id');
    t.float('createdAt');
    t.float('updatedAt');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.string('description');
    t.nonNull.string('channelGroupID');
    t.nonNull.string('type');
    t.nonNull.string('lockerRoomID');
    t.string('livestreamID');

    // dynamic
    t.field('Livestream', {
      type: 'Livestream',
      resolve: async ({livestreamID}) => {
        if (!livestreamID) {
          return null;
        }
        return await livestreamIDExists(livestreamID);
      },
    });
    // t.field('ChannelGroup', {
    //   type: 'ChannelGroup',
    //   resolve: async ({channelGroupID}) => {
    //     return await ChannelGroup.findById(channelGroupID).exec();
    //   },
    // });
  },
});
