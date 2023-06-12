import {Message, User} from 'lib-mongoose';
import addReadMessage from './addReadMessage';
import isTextMediaGifNull from '../checker/isTextMediaGifNull';
import isMediaNotEmpty from '../checker/isMediaNotEmpty';
import addNotification from './addNotification';

export default async function (
  uid: string | null | undefined,
  userID: string,
  channelSlug: string,
  text: string | null | undefined,
  chatID: string,
  repliedToChatID?: string | null,
  Media?: {objectID: string; objectType: string}[] | null,
  MentionedUserIDs?: string[] | null,
  gif?: string | null
) {
  uid = uid ? uid : (await User.findById(userID).exec())?.uid;
  // Check if text, Media and/or gif are null.
  isTextMediaGifNull(text, Media, gif);
  // Check if Media is not empty.
  await isMediaNotEmpty(Media);
  // Send Message
  const result = await Message.create({userID, channelSlug, text, chatID, repliedToChatID, Media, gif});
  // Read Message to update latest message seen on channel
  await addReadMessage(uid, channelSlug);

  if (repliedToChatID || MentionedUserIDs) {
    await addNotification({
      repliedToChatID,
      MentionedUserIDs,
      actorUserID: userID,
      actorUid: uid!,
      messageID: result.id,
      chatID,
      channelSlug,
      text,
      Media,
      gif,
    });
  }
  return result;
}
