import {objectType} from 'nexus';

export const MutationResult = objectType({
  name: 'MutationResult',
  definition(t) {
    t.float('timestamp');
    t.nonNull.boolean('success');
    t.string('objectID');
    t.string('objectType');
  },
});
