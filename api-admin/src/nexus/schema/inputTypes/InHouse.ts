import {inputObjectType} from 'nexus';

export const InputInHouse = inputObjectType({
  name: 'InputInHouse',
  definition(t) {
    t.nonNull.string('name');
    t.field('Avatar', {type: 'InputMedia'});
    t.field('CoverPhoto', {type: 'InputMedia'});
    t.nonNull.list.nonNull.string('sportIDs');
  },
});
