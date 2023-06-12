/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Document, Types } from 'mongoose';
export interface ClubMediaModel {
    objectType: string;
    objectID: string;
}
export interface ClubModel {
    createdAt: number;
    updatedAt: number;
    name: string;
    slug: string;
    sportIDs: string[];
    Avatar?: ClubMediaModel | null;
    CoverPhoto?: ClubMediaModel | null;
    leagueID?: string | null;
    isFeatured?: boolean | null;
}
export interface ClubMediaDocument extends Document<Types.ObjectId | string>, ClubMediaModel {
}
export interface ClubDocument extends Document<Types.ObjectId | string>, ClubModel {
}
export declare const Club: import("mongoose").Model<ClubDocument, {}, {}, {}, any>;
