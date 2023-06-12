"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemChannel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    createdAt: { type: Number, default: () => new Date().getTime() },
    updatedAt: { type: Number, default: () => new Date().getTime() },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    systemChannelGroupID: { type: String, required: true },
    type: { type: String, required: true },
    isDeleted: { type: Boolean, default: () => false },
    systemLockerRoomID: { type: String, required: true },
    livestreamID: { type: String, default: () => null },
});
schema.index({ systemChannelGroupID: 1 });
schema.index({ slug: 1 }, { unique: true });
schema.index({ _id: 1, isDeleted: 1 });
schema.index({ systemChannelGroupID: 1, isDeleted: 1 });
schema.index({ systemLockerRoomID: 1, isDeleted: 1 });
schema.set('toJSON', { virtuals: true });
exports.SystemChannel = (0, mongoose_1.model)('SystemChannel', schema, 'SystemChannel');
//# sourceMappingURL=SystemChannel.js.map