import {inputObjectType} from 'nexus';

export const InputGamePartner = inputObjectType({
  name: 'InputGamePartner',
  definition(t) {
    t.nonNull.string('name');
    t.field('Icon', {type: 'InputMedia'});
    t.boolean('isHidden');
  },
});
