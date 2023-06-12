import {Notification} from 'lib-mongoose';
import messageRepliedToChatIDExists from '../checker/messageRepliedToChatIDExists';
import userIDExists from '../checker/userIDExists';
import getMentionedUserIDs from '../getter/getMentionedUserIDs';
import pushNotification from '../fcmNotification/pushNotification';
import channelSlugExists from '../checker/channelSlugExists';
import lockerRoomIDExists from '../checker/lockerRoomIDExists';

interface INotification {
  repliedToChatID: string | null | undefined;
  MentionedUserIDs: string[] | null | undefined;
  actorUserID: string;
  actorUid: string;
  messageID: string;
  chatID: string;
  channelSlug: string;
  text: string | null | undefined;
  Media?: {objectID: string; objectType: string}[] | null;
  gif?: string | null;
}
export default async function (data: INotification) {
  const {repliedToChatID, MentionedUserIDs, actorUserID, actorUid, messageID, chatID, channelSlug, text, Media, gif} =
    data;
  let targetUserID: string | null | undefined;
  let targetUid;
  const {lockerRoomID, id: channelID} = await channelSlugExists(channelSlug);
  const lockerRoom = await lockerRoomIDExists(lockerRoomID);
  const [groupType, groupID] = lockerRoom.group.split(':');

  if (repliedToChatID) {
    ({userID: targetUserID} = await messageRepliedToChatIDExists(repliedToChatID));
    ({uid: targetUid} = await userIDExists(targetUserID));
    const exists = await Notification.findOne({actorUserID, targetUserID, messageID, type: 'Reply'}).exec();
    if (targetUserID !== actorUserID && !exists) {
      let payload: any = {
        actorUserID,
        actorUid,
        targetUserID,
        targetUid,
        messageID,
        chatID,
        channelSlug,
        type: 'Reply',
      };
      await Notification.create(payload);
      if (groupType === 'Game') {
        payload = {
          ...payload,
          gameID: groupID,
          group: lockerRoom.group,
          type: 'EventChatReply',
        };
      }
      payload = {
        ...payload,
        text,
        Media,
        lockerRoomID,
        channelID,
        gif,
      };
      await pushNotification(targetUserID, payload);
    }
  }
  if (MentionedUserIDs) {
    const initialMentionedUserIDs = await getMentionedUserIDs(chatID, actorUserID);
    const newUserIDs: string[] = [];

    MentionedUserIDs.map((newUserID: string) => {
      if (!initialMentionedUserIDs.includes(newUserID) && actorUserID !== newUserID && targetUserID !== newUserID) {
        newUserIDs.push(newUserID);
      }
    });
    for (const mentionedTargetUserID of newUserIDs) {
      // actorUserID - cannot notify self
      // targetUserID - will not notify owner of repliedToChatID with type: Mention
      if (actorUserID !== mentionedTargetUserID && targetUserID !== mentionedTargetUserID) {
        const {uid: targetUid} = await userIDExists(mentionedTargetUserID);
        let payload: any = {
          actorUserID,
          actorUid,
          targetUserID: mentionedTargetUserID,
          targetUid,
          messageID,
          chatID,
          channelSlug,
          type: 'Mention',
        };
        await Notification.create(payload);
        if (groupType === 'Game') {
          payload = {
            ...payload,
            gameID: groupID,
            group: lockerRoom.group,
            type: 'EventChatMention',
          };
        }
        payload = {
          ...payload,
          text,
          Media,
          lockerRoomID,
          channelID,
          gif,
        };
        await pushNotification(mentionedTargetUserID, payload);
      }
    }
  }
}
