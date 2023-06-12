import {UserInvites} from 'lib-mongoose';
import {UserInputError} from 'apollo-server-express';

export default async function (id: string) {
  const exists = await UserInvites.findById(id).exec();
  if (!exists) {
    throw new UserInputError(`User Invite does not exist. Input: ${id}`);
  }
  // else {
  //   if (exists.expiration < new Date().getTime()) {
  //     throw new UserInputError('The invitation has expired. Please use another one.');
  //   }
  // }
  return exists;
}
