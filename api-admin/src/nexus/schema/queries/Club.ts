import {queryField, stringArg} from 'nexus';
import {Club} from 'lib-mongoose';

export const ClubQuery = queryField(t => {
  t.field('getClub', {
    type: 'Club',
    args: {
      id: stringArg(),
      slug: stringArg(),
    },
    resolve: async (source, {id, slug}) => {
      if (id) {
        return await Club.findById(id).exec();
      }
      if (slug) {
        return await Club.findOne({slug}).exec();
      }
      return null;
    },
  });
  t.nonNull.field('getClubs', {
    type: 'Clubs',
    resolve: async () => {
      const items = await Club.find().exec();
      return {
        count: items.length,
        total: items.length,
        items: items,
      };
    },
  });
});
