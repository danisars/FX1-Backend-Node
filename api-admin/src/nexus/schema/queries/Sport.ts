import {queryField, stringArg} from 'nexus';
import {Sport} from 'lib-mongoose';

export const SportQuery = queryField(t => {
  t.field('getSport', {
    type: 'Sport',
    args: {
      id: stringArg(),
      slug: stringArg(),
    },
    resolve: async (source, {id, slug}) => {
      if (id) {
        return await Sport.findById(id).exec();
      }
      if (slug) {
        return await Sport.findOne({slug}).exec();
      }
      return null;
    },
  });
  t.nonNull.field('getSports', {
    type: 'Sports',
    resolve: async () => {
      const items = await Sport.find().exec();
      return {
        count: items.length,
        total: items.length,
        items: items,
      };
    },
  });
});
