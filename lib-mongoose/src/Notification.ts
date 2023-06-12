import {model, Schema, Document, Types} from 'mongoose';

export interface NotificationModel {
  createdAt: number;
  actorUserID: string;
  actorUid: string;
  targetUserID: string;
  targetUid: string;
  messageID: string;
  chatID: string;
  channelSlug: string;
  type: string;
  isRead?: boolean | null;
  isSeen?: boolean | null;
}

const schema = new Schema<NotificationDocument>({
  createdAt: {type: Number, default: () => new Date().getTime()},
  actorUserID: {type: String, required: true},
  actorUid: {type: String, required: true},
  targetUserID: {type: String, required: true},
  targetUid: {type: String, required: true},
  messageID: {type: String, required: true},
  chatID: {type: String, required: true},
  channelSlug: {type: String, required: true},
  type: {type: String, enum: ['Reply', 'Mention'], required: true},
  isRead: {type: Boolean, default: () => false},
  isSeen: {type: Boolean, default: () => false},
});

schema.index(
  {actorUserID: 1, targetUserID: 1, messageID: 1, type: 1},
  {unique: true}
);
schema.index({targetUid: 1, isRead: 1});
schema.index({targetUid: 1, isSeen: 1});
schema.index({createdAt: 1, targetUid: 1});
schema.index({chatID: 1, targetUserID: 1});

schema.set('toJSON', {virtuals: true});

export interface NotificationDocument
  extends Document<Types.ObjectId | string>,
    NotificationModel {}

export const Notification = model<NotificationDocument>(
  'Notification',
  schema,
  'Notification'
);
