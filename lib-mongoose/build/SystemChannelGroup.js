"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemChannelGroup = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    createdAt: { type: Number, default: () => new Date().getTime() },
    updatedAt: { type: Number, default: () => new Date().getTime() },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    systemLockerRoomID: { type: String, required: true },
    isDeleted: { type: Boolean, default: () => false },
});
schema.index({ slug: 1 }, { unique: true });
schema.set('toJSON', { virtuals: true });
exports.SystemChannelGroup = (0, mongoose_1.model)('SystemChannelGroup', schema, 'SystemChannelGroup');
//# sourceMappingURL=SystemChannelGroup.js.map