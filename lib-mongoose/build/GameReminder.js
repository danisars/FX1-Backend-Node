"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameReminder = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    createdAt: { type: Number, default: () => new Date().getTime() },
    updatedAt: { type: Number, default: () => new Date().getTime() },
    uid: { type: String, required: true },
    userID: { type: String, required: true },
    gameID: { type: String, required: true },
    reminderSent: { type: Boolean, default: () => false },
    emailBatchID: { type: String },
    scheduledTime: { type: Number },
});
schema.index({ gameID: 1 });
schema.index({ userID: 1 });
schema.set('toJSON', { virtuals: true });
exports.GameReminder = (0, mongoose_1.model)('GameReminder', schema, 'GameReminder');
//# sourceMappingURL=GameReminder.js.map