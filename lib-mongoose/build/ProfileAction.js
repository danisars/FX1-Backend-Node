"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileAction = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    time: { type: Number, default: () => new Date().getTime() },
    action: String,
    actorUserID: String,
    targetUserID: String,
});
schema.index({ action: 1, actorUserID: 1, targetUserID: 1 }, { unique: true });
schema.set('toJSON', { virtuals: true });
exports.ProfileAction = (0, mongoose_1.model)('ProfileAction', schema, 'ProfileAction');
//# sourceMappingURL=ProfileAction.js.map