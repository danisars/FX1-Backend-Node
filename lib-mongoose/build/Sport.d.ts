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
export interface SportMediaModel {
    objectType: string;
    objectID: string;
    isSport?: boolean | null;
}
export interface SportModel {
    createdAt: number;
    updatedAt: number;
    name: string;
    slug: string;
    Avatar: SportMediaModel;
    CoverPhoto: SportMediaModel;
    Icon: SportMediaModel | null;
    status: string;
    isHidden?: boolean | null;
}
export interface SportMediaDocument extends Document<Types.ObjectId | string>, SportMediaModel {
}
export interface SportDocument extends Document<Types.ObjectId | string>, SportModel {
}
export declare const Sport: import("mongoose").Model<SportDocument, {}, {}, {}, any>;
