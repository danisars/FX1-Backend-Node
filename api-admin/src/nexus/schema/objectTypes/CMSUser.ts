import {objectType} from 'nexus';

export const CMSUser = objectType({
  name: 'CMSUser',
  definition(t) {
    t.id('id');
    t.float('createdAt');
    t.float('updatedAt');
    t.nonNull.string('slug');
    t.nonNull.string('firstName');
    t.nonNull.string('lastName');
    t.string('contactNumber');
    t.string('jobTitle');
    t.string('country');
    t.string('birthDate');
    t.string('profilePhotoID');
    t.nonNull.string('uid');
    t.nonNull.string('email');
    t.nonNull.string('displayName');
    t.nonNull.string('accessLevel');
    t.nonNull.string('invitedBy');
    t.string('name');
  },
});
