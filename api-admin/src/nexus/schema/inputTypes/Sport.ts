import {inputObjectType} from 'nexus';

export const InputSport = inputObjectType({
  name: 'InputSport',
  definition(t) {
    t.nonNull.string('name');
    t.string('status');
    t.boolean('isHidden');
    t.nonNull.field('Avatar', {type: 'InputMedia'});
    t.nonNull.field('CoverPhoto', {type: 'InputMedia'});
    t.field('Icon', {type: 'InputMedia'});
  },
});
