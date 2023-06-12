import {queryField, stringArg} from 'nexus';
import {LockerRoom} from 'lib-mongoose';

export const LockerRoomQuery = queryField(t => {
  t.field('getLockerRoom', {
    type: 'LockerRoom',
    args: {
      id: stringArg(),
      slug: stringArg(),
    },
    resolve: async (source, {id, slug}) => {
      if (id) {
        return (await LockerRoom.findById(id).exec()) || null;
      }
      if (slug) {
        return (await LockerRoom.findOne({slug}).exec()) || null;
      }
      return null;
    },
  });
  t.nonNull.field('getLockerRooms', {
    type: 'LockerRooms',
    resolve: async () => {
      const items = await LockerRoom.find().exec();
      return {
        count: items.length,
        total: items.length,
        items: items,
      };
    },
  });
});
