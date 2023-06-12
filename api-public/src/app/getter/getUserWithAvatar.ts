import {User} from 'lib-mongoose';
import {getPhotoURL} from '../../nexus/schema';

export default async function (uid: string | null | undefined) {
  const user: any = await User.findOne({
    uid,
  }).lean();
  if (user.Avatar) {
    user.Avatar = {
      objectType: user.Avatar.objectType,
      objectID: user.Avatar.objectID,
      PhotoURL: getPhotoURL(user.Avatar?.objectID, user.Avatar?.objectType),
    };
  }
  return user;
}
