import {model, Schema, Document, Types} from 'mongoose';

export interface ReadMessageModel {
  createdAt: number;
  channelSlug: string;
  messageID: string;
  chatID: string;
  userID: string;
  uid: string;
}

const schema = new Schema<ReadMessageDocument>({
  createdAt: {type: Number, default: () => new Date().getTime()},
  channelSlug: {type: String, required: true},
  messageID: {type: String, required: true},
  chatID: {type: String, required: true},
  userID: {type: String, required: true},
  uid: {type: String, required: true},
});

schema.index(
  {messageID: 1, chatID: 1, userID: 1, channelSlug: 1},
  {unique: true}
);
schema.index({userID: 1, channelSlug: 1});
schema.index({uid: 1, channelSlug: 1});

schema.set('toJSON', {virtuals: true});

export interface ReadMessageDocument
  extends Document<Types.ObjectId | string>,
    ReadMessageModel {}

export const ReadMessage = model<ReadMessageDocument>(
  'ReadMessage',
  schema,
  'ReadMessage'
);
