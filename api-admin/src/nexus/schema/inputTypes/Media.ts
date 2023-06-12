import {inputObjectType} from 'nexus';

export const InputMedia = inputObjectType({
  name: 'InputMedia',
  definition(t) {
    t.nonNull.string('objectID');
    t.nonNull.string('objectType');
  },
});
