"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadMessage = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    createdAt: { type: Number, default: () => new Date().getTime() },
    channelSlug: { type: String, required: true },
    messageID: { type: String, required: true },
    chatID: { type: String, required: true },
    userID: { type: String, required: true },
    uid: { type: String, required: true },
});
schema.index({ messageID: 1, chatID: 1, userID: 1, channelSlug: 1 }, { unique: true });
schema.index({ userID: 1, channelSlug: 1 });
schema.index({ uid: 1, channelSlug: 1 });
schema.set('toJSON', { virtuals: true });
exports.ReadMessage = (0, mongoose_1.model)('ReadMessage', schema, 'ReadMessage');
//# sourceMappingURL=ReadMessage.js.map