"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelGroup = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    createdAt: { type: Number, default: () => new Date().getTime() },
    updatedAt: { type: Number, default: () => new Date().getTime() },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    group: { type: String, required: true },
    lockerRoomID: { type: String, required: true },
    isDeleted: { type: Boolean, default: () => false },
    withLivestream: { type: Boolean, default: () => false },
});
schema.index({ lockerRoomID: 1 });
schema.index({ slug: 1 }, { unique: true });
schema.index({ _id: 1, isDeleted: 1 });
schema.index({ lockerRoomID: 1, isDeleted: 1 });
schema.index({ lockerRoomID: 1, withLivestream: 1 });
schema.set('toJSON', { virtuals: true });
exports.ChannelGroup = (0, mongoose_1.model)('ChannelGroup', schema, 'ChannelGroup');
//# sourceMappingURL=ChannelGroup.js.map