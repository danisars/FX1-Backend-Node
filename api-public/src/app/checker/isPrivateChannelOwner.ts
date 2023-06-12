import {UserInputError} from 'apollo-server-express';
import {UserRole} from 'lib-mongoose';

export default async (privateChannelID: string, uid: string, throwError = true) => {
  const result = await UserRole.findOne({groupID: privateChannelID, uid, role: 'owner'});
  if (!result && throwError) {
    throw new UserInputError('You are not the owner of this private channel.');
  }
  return result;
};
