import {objectType} from 'nexus';

export const Sport = objectType({
  name: 'Sport',
  definition(t) {
    t.id('id');
    t.float('createdAt');
    t.float('updatedAt');
    t.nonNull.string('name');
    t.nonNull.string('slug');
    t.nonNull.string('status');
    t.nonNull.field('Avatar', {
      type: 'Media',
    });
    t.nonNull.field('CoverPhoto', {
      type: 'Media',
    });
    t.field('Icon', {
      type: 'Media',
    });
  },
});
