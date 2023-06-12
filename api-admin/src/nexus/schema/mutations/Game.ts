import {mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import {Game} from 'lib-mongoose';
import stringToObjectId from '../../../app/transform/stringToObjectId';

export const GameMutations = mutationField(t => {
  t.nonNull.field('setFeaturedGame', {
    type: 'MutationResult',
    args: {
      objectID: nonNull(stringArg()),
    },
    resolve: async (source, {objectID}) => {
      const existingFeaturedGames = await Game.find({isFeatured: true}).exec();
      await Game.findByIdAndUpdate(objectID, {
        isFeatured: true,
      })
        .exec()
        .then(async () => {
          if (existingFeaturedGames.length > 0) {
            await Game.updateMany(
              {isFeatured: true, _id: {$ne: stringToObjectId(objectID)}},
              {isFeatured: false}
            );
          }
        })
        .catch(() => {
          throw new Error('Game not found.');
        });
      return new MutationResult('Game', objectID);
    },
  });
});
