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
export interface GamePartnerMediaModel {
    objectType: string;
    objectID: string;
    isSport?: boolean | null;
}
export interface GamePartnerModel {
    name: string;
    slug: string;
    Icon?: GamePartnerMediaModel | null;
    Logo?: GamePartnerMediaModel | null;
    isHidden?: boolean;
}
export interface GamePartnerMediaDocument extends Document<Types.ObjectId | string>, GamePartnerMediaModel {
}
export interface GamePartnerDocument extends Document<Types.ObjectId | string>, GamePartnerModel {
}
export declare const GamePartner: import("mongoose").Model<GamePartnerDocument, {}, {}, {}, any>;
