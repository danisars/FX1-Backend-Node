import {inputObjectType} from 'nexus';

export const InputClub = inputObjectType({
  name: 'InputClub',
  definition(t) {
    t.nonNull.string('name');
    t.field('Avatar', {type: 'InputMedia'});
    t.field('CoverPhoto', {type: 'InputMedia'});
    t.nonNull.list.nonNull.string('sportIDs');
    t.nonNull.string('leagueID');
    t.boolean('isFeatured');
  },
});
