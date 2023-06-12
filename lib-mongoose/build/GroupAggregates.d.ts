import { Document, Types, Model } from 'mongoose';
import { OnlyFieldsOfType } from 'mongodb';
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
export declare type GroupAggregatesIncrementFields = OnlyFieldsOfType<GroupAggregatesModel, number | undefined>;
export interface GroupAggregatesDocument extends Document<Types.ObjectId | string>, GroupAggregatesModel {
}
export interface GroupAggregatesStaticModel extends Model<GroupAggregatesDocument> {
    increment(key: string, fields: GroupAggregatesIncrementFields): void;
}
export declare const GroupAggregates: GroupAggregatesStaticModel;
