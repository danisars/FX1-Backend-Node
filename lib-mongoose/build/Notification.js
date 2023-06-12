"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    createdAt: { type: Number, default: () => new Date().getTime() },
    actorUserID: { type: String, required: true },
    actorUid: { type: String, required: true },
    targetUserID: { type: String, required: true },
    targetUid: { type: String, required: true },
    messageID: { type: String, required: true },
    chatID: { type: String, required: true },
    channelSlug: { type: String, required: true },
    type: { type: String, enum: ['Reply', 'Mention'], required: true },
    isRead: { type: Boolean, default: () => false },
    isSeen: { type: Boolean, default: () => false },
});
schema.index({ actorUserID: 1, targetUserID: 1, messageID: 1, type: 1 }, { unique: true });
schema.index({ targetUid: 1, isRead: 1 });
schema.index({ targetUid: 1, isSeen: 1 });
schema.index({ createdAt: 1, targetUid: 1 });
schema.index({ chatID: 1, targetUserID: 1 });
schema.set('toJSON', { virtuals: true });
exports.Notification = (0, mongoose_1.model)('Notification', schema, 'Notification');
//# sourceMappingURL=Notification.js.map