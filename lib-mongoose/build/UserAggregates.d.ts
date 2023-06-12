import { Document, Types, Model } from 'mongoose';
import { OnlyFieldsOfType } from 'mongodb';
export interface UserAggregatesModel {
    userID?: string | null;
    supports?: number | null;
}
export declare type UserAggregatesIncrementFields = OnlyFieldsOfType<UserAggregatesModel, number | undefined>;
export interface UserAggregatesDocument extends Document<Types.ObjectId | string>, UserAggregatesModel {
}
export interface UserAggregatesStaticModel extends Model<UserAggregatesDocument> {
    increment(key: string, fields: UserAggregatesIncrementFields): void;
}
export declare const UserAggregates: UserAggregatesStaticModel;
