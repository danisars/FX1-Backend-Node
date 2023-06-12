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

// export const MutationResultWithRedirectUrl = objectType({
//   name: 'MutationResultWithRedirectUrl',
//   definition(t) {
//     t.float('timestamp');
//     t.nonNull.boolean('success');
//     t.string('objectID');
//     t.string('objectType');
//     t.string('redirectUrl');
//   },
// });

// export const MutationResultWithInviteUrl = objectType({
//   name: 'MutationResultWithInviteUrl',
//   definition(t) {
//     t.float('timestamp');
//     t.nonNull.boolean('success');
//     t.string('objectID');
//     t.string('objectType');
//     t.nonNull.string('inviteUrl');
//   },
// });
