import {UserRole} from 'lib-mongoose';
import {UserInputError} from 'apollo-server-express';

export default async function (lockerRoomID: string, userID: string) {
  const owner = await UserRole.findOne({
    lockerRoomID,
    userID,
    groupType: 'Channel',
  }).exec();

  if (owner) {
    throw new UserInputError('You cannot create or join more than one private group per game.');
  }
}
