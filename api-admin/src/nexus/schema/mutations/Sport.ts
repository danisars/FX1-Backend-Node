import {arg, mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import {GroupAggregates, Sport, League, Club} from 'lib-mongoose';
import stringToSlug from '../../../app/transform/stringToSlug';

interface IInputSport {
  name: string;
  isHidden?: boolean | null;
  Avatar: {objectID: string; objectType: string};
  CoverPhoto: {objectID: string; objectType: string};
  Icon?: {objectID: string; objectType: string} | null;
  status?: string | null;
}

/*
 * Note: When creating a sport, be sure to upload the image first on sports/ as .webp then supply its file name
 * as the objectID with objectType of Photo
 */
async function implementation(
  type: string,
  input: IInputSport | null,
  id: string | null
) {
  if (type === 'create') {
    const slug = await stringToSlug(Sport, input!.name, false, true);
    const result = await Sport.create({...input, slug});
    await GroupAggregates.create({group: `Sport:${result.id}`});
    return result.id;
  }
  if (type === 'edit') {
    const result = await Sport.findByIdAndUpdate(id, {
      ...input,
      updatedAt: new Date().getTime(),
    }).exec();
    return result?.id;
  }
  if (type === 'delete') {
    const checkLeague = await League.find({
      sportIDs: id,
    }).exec();
    const checkClub = await Club.find({
      sportIDs: id,
    }).exec();
    if (checkLeague.length > 0 || checkClub.length > 0) {
      throw new Error(
        `Can no longer delete sport. It is referenced on the ffg: League: ${checkLeague.length}, Club: ${checkClub.length}`
      );
    }

    const sport = await Sport.findByIdAndDelete(id).exec();
    if (sport) {
      await GroupAggregates.findOneAndDelete({group: `Sport:${id}`}).exec();
    }
    return id;
  }
  return null;
}

export const SportMutations = mutationField(t => {
  t.nonNull.field('createSport', {
    type: 'MutationResult',
    args: {
      input: arg({type: nonNull('InputSport')}),
    },
    resolve: async (source, {input}) => {
      const result = await implementation('create', input, null);
      return new MutationResult('Sport', result);
    },
  });
  t.nonNull.field('editSport', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
      input: arg({type: nonNull('InputSport')}),
    },
    resolve: async (source, {id, input}) => {
      const result = await implementation('edit', input, id);
      return new MutationResult('Sport', result);
    },
  });
  t.nonNull.field('deleteSport', {
    type: 'MutationResult',
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (source, {id}) => {
      const result = await implementation('delete', null, id);
      return new MutationResult('Sport', result);
    },
  });
});
