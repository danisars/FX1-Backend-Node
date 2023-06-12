import {model, Schema, Document, Types, ObjectId} from 'mongoose';

export interface GameReminderModel {
  createdAt: number;
  updatedAt: number;
  uid: string;
  userID: string;
  gameID: string;
  reminderSent: boolean;
  scheduledTime: number;
  emailBatchID: string;
}

const schema = new Schema<GameReminderDocument>({
  createdAt: {type: Number, default: () => new Date().getTime()},
  updatedAt: {type: Number, default: () => new Date().getTime()},
  uid: {type: String, required: true},
  userID: {type: String, required: true},
  gameID: {type: String, required: true},
  reminderSent: {type: Boolean, default: () => false},
  emailBatchID: {type: String},
  scheduledTime: {type: Number},
});

schema.index({gameID: 1});
schema.index({userID: 1});

schema.set('toJSON', {virtuals: true});

export interface GameReminderDocument
  extends Document<Types.ObjectId | string>,
    GameReminderModel {
}

export const GameReminder = model<GameReminderDocument>('GameReminder', schema, 'GameReminder');
