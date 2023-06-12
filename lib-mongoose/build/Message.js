"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const mediaSchema = new mongoose_1.Schema({
    objectType: { type: String, enum: ['Photo', 'Video'] },
    objectID: String,
});
const schema = new mongoose_1.Schema({
    createdAt: { type: Number, default: () => new Date().getTime() },
    updatedAt: { type: Number, default: () => new Date().getTime() },
    userID: { type: String, required: true },
    channelSlug: { type: String, required: true },
    text: { type: String },
    chatID: { type: String, required: true },
    repliedToChatID: { type: String, default: () => null },
    Media: { type: [mediaSchema], default: () => null },
    isDeletedSelf: { type: Boolean, default: () => false },
    isDeletedEveryone: { type: Boolean, default: () => false },
    isEdited: { type: Boolean, default: () => false },
    gif: { type: String, default: () => null },
});
schema.index({ channelSlug: 1 });
schema.index({ _id: 1, channelSlug: 1 });
schema.index({ chatID: 1 }, { unique: true });
schema.set('toJSON', { virtuals: true });
exports.Message = (0, mongoose_1.model)('Message', schema, 'Message');
//# sourceMappingURL=Message.js.map