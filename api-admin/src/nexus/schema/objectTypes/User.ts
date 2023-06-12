import {objectType} from 'nexus';
import getZipCode from '../../../app/getter/getZipCode';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.id('id');
    t.float('createdAt');
    t.float('updatedAt');
    t.nonNull.string('username');
    t.nonNull.string('slug');
    t.nonNull.string('uid');
    t.string('firstName');
    t.string('lastName');
    t.nonNull.string('emailAddress');
    t.string('zipCode');
    t.field('Avatar', {type: 'Media'});

    // dynamic
    t.field('ZipCode', {
      type: 'ZipCode',
      resolve: async ({zipCode}) => {
        if (!zipCode) {
          return null;
        }
        return await getZipCode(zipCode);
      },
    });
  },
});
