import {model, Schema, Document, Types, Model} from 'mongoose';
import {OnlyFieldsOfType} from 'mongodb';

export interface UserAggregatesModel {
  userID?: string | null;
  supports?: number | null;
}

export type UserAggregatesIncrementFields = OnlyFieldsOfType<
  UserAggregatesModel,
  number | undefined
>;

export interface UserAggregatesDocument
  extends Document<Types.ObjectId | string>,
    UserAggregatesModel {}

export interface UserAggregatesStaticModel
  extends Model<UserAggregatesDocument> {
  increment(key: string, fields: UserAggregatesIncrementFields): void;
}

const schema = new Schema<UserAggregatesDocument>({
  userID: String,
  supports: {type: Number, default: () => 0},
});

schema.index({userID: 1}, {unique: true});
schema.set('toJSON', {virtuals: true});

schema.static(
  'increment',
  function (userID: string, fields: UserAggregatesIncrementFields) {
    this.updateOne(
      {userID},
      {$inc: fields, $setOnInsert: {userID}},
      {upsert: true}
    )
      .exec()
      .then();
  }
);

export const UserAggregates = model<
  UserAggregatesDocument,
  UserAggregatesStaticModel
>('UserAggregates', schema, 'UserAggregates');
