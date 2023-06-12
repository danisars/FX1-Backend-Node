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
export interface InHouseMediaModel {
    objectType: string;
    objectID: string;
}
export interface InHouseModel {
    createdAt: number;
    updatedAt: number;
    name: string;
    slug: string;
    sportIDs: string[];
    Avatar?: InHouseMediaModel | null;
    CoverPhoto?: InHouseMediaModel | null;
}
export interface InHouseMediaDocument extends Document<Types.ObjectId | string>, InHouseMediaModel {
}
export interface InHouseDocument extends Document<Types.ObjectId | string>, InHouseModel {
}
export declare const InHouse: import("mongoose").Model<InHouseDocument, {}, {}, {}, any>;
