import {inputObjectType} from 'nexus';

export const InputCreateCMSUser = inputObjectType({
  name: 'InputCreateCMSUser',
  definition(t) {
    t.nonNull.string('accessLevel');
    t.nonNull.string('displayName');
    t.nonNull.string('email');
    t.string('birthDate');
    t.string('contactNumber');
    t.string('country');
    t.nonNull.string('firstName');
    t.string('jobTitle');
    t.nonNull.string('lastName');
    t.string('profilePhotoID');
    t.nonNull.string('password');
  },
});

export const InputEditCMSUserProfile = inputObjectType({
  name: 'InputEditCMSUserProfile',
  definition(t) {
    t.nonNull.string('displayName');
    t.string('birthDate');
    t.string('contactNumber');
    t.string('country');
    t.nonNull.string('firstName');
    t.string('jobTitle');
    t.nonNull.string('lastName');
    t.string('profilePhotoID');
  },
});

// export const InputInviteCMSUser = inputObjectType({
//   name: 'InputInviteCMSUser',
//   definition(t) {
//     t.nonNull.string('accessLevel');
//     t.nonNull.string('displayName');
//     t.nonNull.string('email');
//   },
// });

// export const InputCreateCMSUser = inputObjectType({
//   name: 'InputCreateCMSUser',
//   definition(t) {
//     t.string('birthDate');
//     t.string('contactNumber');
//     t.string('country');
//     t.nonNull.string('firstName');
//     t.string('jobTitle');
//     t.nonNull.string('lastName');
//     t.string('profilePhotoID');
//     t.nonNull.string('password');
//   },
// });
