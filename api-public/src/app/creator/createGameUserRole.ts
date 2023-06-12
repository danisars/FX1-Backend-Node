import {ChannelDocument} from 'lib-mongoose';
import createUserRole from './createUserRole';

export default async function (
  result: ChannelDocument,
  userID: string,
  uid: string,
  role: string,
  lockerRoomID: string
) {
  if (result) {
    await createUserRole({
      group: `Channel:${result.id}`,
      groupType: 'Channel',
      groupID: result.id,
      userID,
      uid,
      role,
      status: 'active',
      lockerRoomID,
    });
  }
}
