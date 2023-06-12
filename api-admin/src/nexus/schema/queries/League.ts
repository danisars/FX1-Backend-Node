import {queryField, stringArg} from 'nexus';
import {League} from 'lib-mongoose';

export const LeagueQuery = queryField(t => {
  t.field('getLeague', {
    type: 'League',
    args: {
      id: stringArg(),
      slug: stringArg(),
    },
    resolve: async (source, {id, slug}) => {
      if (id) {
        return await League.findById(id).exec();
      }
      if (slug) {
        return await League.findOne({slug}).exec();
      }
      return null;
    },
  });
  t.nonNull.field('getLeagues', {
    type: 'Leagues',
    resolve: async () => {
      const items = await League.find().exec();
      return {
        count: items.length,
        total: items.length,
        items: items,
      };
    },
  });
});
