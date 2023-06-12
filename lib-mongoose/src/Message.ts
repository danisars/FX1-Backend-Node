import {model, Schema, Document, Types} from 'mongoose';

export interface MessageMediaModel {
  objectType: string;
  objectID: string;
}

export interface MessageModel {
  createdAt: number;
  updatedAt: number;
  userID: string;
  channelSlug: string;
  text: string | null;
  chatID: string;
  repliedToChatID: string | null;
  Media: MessageMediaModel[] | null;
  isDeletedSelf?: boolean | null;
  isDeletedEveryone?: boolean | null;
  isEdited?: boolean | null;
  gif?: string | null;
}

const mediaSchema = new Schema<MessageMediaModel>({
  objectType: {type: String, enum: ['Photo', 'Video']},
  objectID: String,
});

const schema = new Schema<MessageDocument>({
  createdAt: {type: Number, default: () => new Date().getTime()},
  updatedAt: {type: Number, default: () => new Date().getTime()},
  userID: {type: String, required: true},
  channelSlug: {type: String, required: true},
  text: {type: String},
  chatID: {type: String, required: true},
  repliedToChatID: {type: String, default: () => null},
  Media: {type: [mediaSchema], default: () => null},
  isDeletedSelf: {type: Boolean, default: () => false},
  isDeletedEveryone: {type: Boolean, default: () => false},
  isEdited: {type: Boolean, default: () => false},
  gif: {type: String, default: () => null},
});

schema.index({channelSlug: 1});
schema.index({_id: 1, channelSlug: 1});
schema.index({chatID: 1}, {unique: true});

schema.set('toJSON', {virtuals: true});

export interface MessageMediaDocument
  extends Document<Types.ObjectId | string>,
    MessageMediaModel {}

export interface MessageDocument
  extends Document<Types.ObjectId | string>,
    MessageModel {}

export const Message = model<MessageDocument>('Message', schema, 'Message');
