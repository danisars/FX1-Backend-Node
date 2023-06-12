import * as admin from 'firebase-admin';
import {User} from 'lib-mongoose';

export async function validateToken(token: string, app?: admin.app.App) {
  let uid: string | undefined;
  let email: string | undefined;
  let userID: string | undefined;
  let user;
  try {
    user = await (app || admin).auth().verifyIdToken(token);
  } catch (e) {
    try {
      // user = await verifyCustomToken(token);
    } catch (e) {
      throw new Error('Invalid authentication token.');
    }
  }
  if (user) {
    uid = user.uid;
    email = user.email;
    userID = user?.app?.userID;
    if (!userID) {
      userID = (await User.findOne({uid}).exec())?.id;
    }
  }
  return {
    uid,
    email,
    userID,
  };
}
