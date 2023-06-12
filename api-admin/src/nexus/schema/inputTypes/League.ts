import {inputObjectType} from 'nexus';

export const InputLeague = inputObjectType({
  name: 'InputLeague',
  definition(t) {
    t.nonNull.string('name');
    t.field('Avatar', {type: 'InputMedia'});
    t.field('CoverPhoto', {type: 'InputMedia'});
    t.nonNull.list.nonNull.string('sportIDs');
  },
});
