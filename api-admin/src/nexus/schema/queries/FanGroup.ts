import {queryField, stringArg} from 'nexus';
import {FanGroup} from 'lib-mongoose';

export const FanGroupQuery = queryField(t => {
  t.field('getFanGroup', {
    type: 'FanGroup',
    args: {
      id: stringArg(),
      slug: stringArg(),
    },
    resolve: async (source, {id, slug}) => {
      if (id) {
        return await FanGroup.findById(id).exec();
      }
      if (slug) {
        return await FanGroup.findOne({slug}).exec();
      }
      return null;
    },
  });
  t.nonNull.field('getFanGroups', {
    type: 'FanGroups',
    resolve: async () => {
      const items = await FanGroup.find().exec();
      return {
        count: items.length,
        total: items.length,
        items: items,
      };
    },
  });
});
