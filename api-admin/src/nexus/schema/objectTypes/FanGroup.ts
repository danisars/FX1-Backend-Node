import {objectType} from 'nexus';
import stringToObjectId from '../../../app/transform/stringToObjectId';
import {LockerRoom, Sport} from 'lib-mongoose';

export const FanGroup = objectType({
  name: 'FanGroup',
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
        return await LockerRoom.findOne({group: `FanGroup:${id}`}).exec();
      },
    });
  },
});
