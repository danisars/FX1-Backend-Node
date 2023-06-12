"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    createdAt: { type: Number, default: () => new Date().getTime() },
    updatedAt: { type: Number, default: () => new Date().getTime() },
    sport: { type: String },
    gameID: { type: Number },
    team1ID: { type: Number },
    team1City: { type: String },
    team1Name: { type: String },
    team1Ranking: { type: Number },
    team1Score: { type: Number },
    team1Color: { type: String },
    team2ID: { type: Number },
    team2City: { type: String },
    team2Name: { type: String },
    team2Ranking: { type: Number },
    team2Score: { type: Number },
    team2Color: { type: String },
    date: { type: Number },
    location: { type: String },
    headline: { type: String },
    points: { type: Number, default: () => 0 },
    links: { type: Array, default: () => [] },
    timeLeft: { type: String, default: () => '' },
    competition: { type: String },
    coverImage: { type: String },
    pointsLevel: { type: String },
    highPoints: { type: Number },
    isFeatured: { type: Boolean, default: () => false },
    leagueCode: { type: String },
    team1DisplayName: { type: String, default: () => '' },
    team2DisplayName: { type: String, default: () => '' },
    team1Nickname: { type: String },
    team2Nickname: { type: String },
    isLive: { type: Boolean, default: () => false },
});
schema.index({ gameID: 1 }, { unique: true });
schema.index({ date: 1 });
schema.index({ points: 1 });
schema.index({ timeLeft: 1 });
schema.index({ type: 1 });
schema.set('toJSON', { virtuals: true });
exports.Game = (0, mongoose_1.model)('Game', schema, 'Game');
//# sourceMappingURL=Game.js.map