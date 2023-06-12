import {queryField, stringArg} from 'nexus';
import {User} from 'lib-mongoose';

export const getUsers = queryField(t => {
  t.field('getUser', {
    type: 'User',
    args: {
      id: stringArg(),
      slug: stringArg(),
    },
    resolve: async (source, {id, slug}) => {
      if (id) {
        return await User.findById(id).exec();
      }
      if (slug) {
        return await User.findOne({slug}).exec();
      }
      return null;
    },
  });
  t.nonNull.field('getUsers', {
    type: 'Users',
    resolve: async () => {
      const items = await User.find().exec();
      return {
        count: items.length,
        items: items,
      };
    },
  });
});
