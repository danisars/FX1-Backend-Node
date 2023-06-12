import {mutationField, nonNull, stringArg} from 'nexus';
import {MutationResult} from 'lib-api-common';
import {UserRoleType} from 'lib-mongoose';

export const UserRoleTypeMutations = mutationField(t => {
  t.nonNull.field('createUserRoleType', {
    type: 'MutationResult',
    args: {
      name: nonNull(stringArg()),
    },
    resolve: async (source, {name}) => {
      const result = await UserRoleType.findByIdAndUpdate(
        name,
        {id: name, name},
        {upsert: true, new: true}
      ).exec();
      return new MutationResult('UserRoleType', result?.id);
    },
  });
});
