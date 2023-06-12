import {queryField} from 'nexus';
import {GamePartner} from 'lib-mongoose';

export const GamePartnerQuery = queryField(t => {
  t.nonNull.field('getGamePartners', {
    type: 'GamePartners',
    resolve: async () => {
      const items = await GamePartner.find().exec();
      return {
        count: items.length,
        total: items.length,
        items: items,
      };
    },
  });
});
