import {CMSUser} from 'lib-mongoose';

export default async function (uid: string) {
  const exists = await CMSUser.findOne({
    $and: [{uid}, {$or: [{accessLevel: 'Super User'}, {accessLevel: 'Admin'}]}],
  }).exec();
  if (!exists) {
    throw new Error('Action out of scope. You should be an admin.');
  }
}
