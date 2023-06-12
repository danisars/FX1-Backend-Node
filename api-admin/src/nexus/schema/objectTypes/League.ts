import {objectType} from 'nexus';
import stringToObjectId from '../../../app/transform/stringToObjectId';
import {LockerRoom, Sport} from 'lib-mongoose';

export const League = objectType({
  name: 'League',
  definition(t) {
    // schema
    t.id('id');
    t.float('createdAt');
    t.float('updatedAt');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.nonNull.list.nonNull.string('sportIDs');
    t.field('Avatar', {type: 'Media'});
    t.field('CoverPhoto', {type: 'Media'});

    // dynamic
    // t.boolean('isSupported', {
    //   resolve: async ({id}, args, {uid}) => {
    //     return (
    //       (
    //         (await UserRole.find({
    //           group: `League:${id}`,
    //           role: 'supporter',
    //           uid,
    //         })) || []
    //       ).length > 0
    //     );
    //   },
    // });
    //
    // // dynamic
    t.list.nonNull.field('Sports', {
      type: 'Sport',
      resolve: async ({sportIDs}) => {
        const _id = sportIDs.map((id: string) => stringToObjectId(id));
        return await Sport.find({_id: {$in: _id}}).exec();
      },
    });
    t.field('LockerRoom', {
      type: 'LockerRoom',
      resolve: async ({id}) => {
        return await LockerRoom.findOne({group: `League:${id}`}).exec();
      },
    });
    // // dynamic
    // t.list.nonNull.field('ChannelGroups', {
    //   type: 'ChannelGroup',
    //   resolve: async ({id}) => {
    //     return await ChannelGroup.find({parentID: `League:${id}`}).exec();
    //   },
    // });
  },
});
