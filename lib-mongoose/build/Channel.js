"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    createdAt: { type: Number, default: () => new Date().getTime() },
    updatedAt: { type: Number, default: () => new Date().getTime() },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    channelGroupID: { type: String, required: true },
    type: { type: String, required: true },
    isDeleted: { type: Boolean, default: () => false },
    lockerRoomID: { type: String, required: true },
    livestreamID: { type: String, default: () => null },
});
schema.index({ channelGroupID: 1 });
schema.index({ slug: 1 }, { unique: true });
schema.index({ _id: 1, isDeleted: 1 });
schema.index({ channelGroupID: 1, isDeleted: 1 });
schema.index({ lockerRoomID: 1, isDeleted: 1 });
schema.set('toJSON', { virtuals: true });
exports.Channel = (0, mongoose_1.model)('Channel', schema, 'Channel');
//# sourceMappingURL=Channel.js.map