import {queryField, stringArg} from 'nexus';
import {CMSUser} from 'lib-mongoose';

export const CMSUserQuery = queryField(t => {
  t.field('getCMSUser', {
    type: 'CMSUser',
    args: {
      id: stringArg(),
      slug: stringArg(),
    },
    resolve: async (source, {id, slug}) => {
      if (id) {
        return await CMSUser.findById(id).exec();
      }
      if (slug) {
        return await CMSUser.findOne({slug}).exec();
      }
      return null;
    },
  });
  t.nonNull.field('getCMSUsers', {
    type: 'CMSUsers',
    resolve: async () => {
      const items = await CMSUser.find().exec();
      return {
        count: items.length,
        total: items.length,
        items: items,
      };
    },
  });
});
