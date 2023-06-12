import {User} from 'lib-mongoose';

export default async function (id: string) {
  const exists = await User.findById(id).exec();
  if (!exists) {
    throw new Error(`User does not exist. Input: ${id}.`);
  }
  return exists;
}
