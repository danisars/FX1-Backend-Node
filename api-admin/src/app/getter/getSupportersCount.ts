import {UserRole} from 'lib-mongoose';

export default async function (group: string) {
  return await UserRole.countDocuments({group});
}
