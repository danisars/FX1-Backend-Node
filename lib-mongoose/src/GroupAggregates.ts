import {model, Schema, Document, Types, Model} from 'mongoose';
// eslint-disable-next-line node/no-extraneous-import
import {OnlyFieldsOfType} from 'mongodb';

export interface GroupAggregatesModel {
  group: string;
  leagues?: number | null;
  clubs?: number | null;
  channelGroups?: number | null;
  channels?: number | null;
  supporters?: number | null;
  fanGroups?: number | null;
  inHouses?: number | null;
}

export type GroupAggregatesIncrementFields = OnlyFieldsOfType<
  GroupAggregatesModel,
  number | undefined
>;

export interface GroupAggregatesDocument
  extends Document<Types.ObjectId | string>,
    GroupAggregatesModel {}

export interface GroupAggregatesStaticModel
  extends Model<GroupAggregatesDocument> {
  increment(key: string, fields: GroupAggregatesIncrementFields): void;
}

const schema = new Schema<GroupAggregatesDocument>({
  group: String,
  leagues: {type: Number, default: () => 0},
  clubs: {type: Number, default: () => 0},
  channelGroups: {type: Number, default: () => 0},
  channels: {type: Number, default: () => 0},
  supporters: {type: Number, default: () => 0},
  fanGroups: {type: Number, default: () => 0},
  inHouses: {type: Number, default: () => 0},
});

schema.index({group: 1}, {unique: true});
schema.set('toJSON', {virtuals: true});

schema.static(
  'increment',
  function (group: string, fields: GroupAggregatesIncrementFields) {
    this.updateOne(
      {group},
      {$inc: fields, $setOnInsert: {group}},
      {upsert: true}
    )
      .exec()
      .then();
  }
);

export const GroupAggregates = model<
  GroupAggregatesDocument,
  GroupAggregatesStaticModel
>('GroupAggregates', schema, 'GroupAggregates');
