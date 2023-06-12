import {model, Schema, Document, Types} from 'mongoose';

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

const schema = new Schema<GameDocument>({
  createdAt: {type: Number, default: () => new Date().getTime()},
  updatedAt: {type: Number, default: () => new Date().getTime()},
  sport: {type: String},
  gameID: {type: Number},
  team1ID: {type: Number},
  team1City: {type: String},
  team1Name: {type: String},
  team1Ranking: {type: Number},
  team1Score: {type: Number},
  team1Color: {type: String},
  team2ID: {type: Number},
  team2City: {type: String},
  team2Name: {type: String},
  team2Ranking: {type: Number},
  team2Score: {type: Number},
  team2Color: {type: String},
  date: {type: Number},
  location: {type: String},
  headline: {type: String},
  points: {type: Number, default: () => 0},
  links: {type: Array, default: (): LinkModel[] => []},
  timeLeft: {type: String, default: () => ''},
  competition: {type: String},
  coverImage: {type: String},
  pointsLevel: {type: String},
  highPoints: {type: Number},
  isFeatured: {type: Boolean, default: () => false},
  leagueCode: {type: String},
  team1DisplayName: {type: String, default: () => ''},
  team2DisplayName: {type: String, default: () => ''},
  team1Nickname: {type: String},
  team2Nickname: {type: String},
  isLive: {type: Boolean, default: () => false},
});

schema.index({gameID: 1}, {unique: true});
schema.index({date: 1});
schema.index({points: 1});
schema.index({timeLeft: 1});
schema.index({type: 1});

schema.set('toJSON', {virtuals: true});

export interface GameDocument
  extends Document<Types.ObjectId | string>,
    GameModel {
}

export const Game = model<GameDocument>('Game', schema, 'Game');
