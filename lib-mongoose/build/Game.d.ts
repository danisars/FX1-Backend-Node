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
export interface LinkModel {
    source: string;
    type: string;
    url: string;
}
export interface GameModel {
    createdAt: number;
    updatedAt: number;
    sport: string;
    gameID: number;
    date: number;
    points: number;
    leagueCode: string;
    team1ID?: number;
    team1City?: string;
    team1Name?: string;
    team1Ranking?: number;
    team1Score?: number;
    team1Color?: string;
    team2ID?: number;
    team2City?: string;
    team2Name?: string;
    team2Ranking?: number;
    team2Score?: number;
    team2Color?: string;
    location?: string;
    headline?: string;
    links?: LinkModel[];
    timeLeft?: string;
    competition?: string;
    coverImage?: string;
    pointsLevel?: string;
    highPoints?: number;
    isFeatured?: boolean;
    team1DisplayName: string;
    team2DisplayName: string;
    team1Nickname?: string;
    team2Nickname?: string;
    isLive?: boolean;
}
export interface GameDocument extends Document<Types.ObjectId | string>, GameModel {
}
export declare const Game: import("mongoose").Model<GameDocument, {}, {}, {}, any>;
