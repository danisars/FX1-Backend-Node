import {objectType} from 'nexus';
import {Channel} from 'lib-mongoose';

export const ChannelGroup = objectType({
  name: 'ChannelGroup',
  definition(t) {
    t.id('id');
    t.float('createdAt');
    t.float('updatedAt');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.string('description');
    t.nonNull.string('group');
    t.nonNull.string('lockerRoomID');
    t.boolean('withLivestream');
    // dynamic
    // t.field('Club', {
    //   type: 'Club',
    //   resolve: async ({group}) => {
    //     const [objectType, objectID] = group.split(':');
    //     return objectType === 'Club'
    //       ? await Club.findById(objectID).exec()
    //       : null;
    //   },
    // });
    //
    // t.field('League', {
    //   type: 'League',
    //   resolve: async ({group}) => {
    //     const [objectType, objectID] = group.split(':');
    //     return objectType === 'League'
    //       ? await League.findById(objectID).exec()
    //       : null;
    //   },
    // });
    t.list.field('Channels', {
      type: 'Channel',
      resolve: async ({id}) => {
        return await Channel.find({channelGroupID: id}).exec();
      },
    });
  },
});
