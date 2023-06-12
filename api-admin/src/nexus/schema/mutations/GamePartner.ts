import {arg, mutationField, nonNull} from 'nexus';
import {MutationResult} from 'lib-api-common';
import {GamePartner} from 'lib-mongoose';
import slugify from '@sindresorhus/slugify';

export const GamePartnerMutations = mutationField(t => {
  t.nonNull.field('createGamePartner', {
    type: 'MutationResult',
    args: {
      input: arg({type: nonNull('InputGamePartner')}),
    },
    resolve: async (source, {input}) => {
      const result = await GamePartner.findOneAndUpdate(
        {name: input.name},
        {...input, slug: slugify(input.name)},
        {upsert: true, new: true}
      ).exec();
      return new MutationResult('Game', result.id);
    },
  });
});
