"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInvites = void 0;
const mongoose_1 = require("mongoose");
const { Mixed } = mongoose_1.Schema.Types;
const schema = new mongoose_1.Schema({
    time: { type: Number, default: () => new Date().getTime() },
    type: { type: String, enum: ['InviteUserInLockerRoomForManagerialRole', 'InviteToPrivateChannel'] },
    userID: { type: String, required: true },
    group: { type: String, required: true },
    url: { type: String },
    data: Mixed,
    expiration: { type: Number },
});
schema.index({ type: 1 });
schema.index({ userID: 1 });
schema.set('toJSON', { virtuals: true });
exports.UserInvites = (0, mongoose_1.model)('UserInvites', schema, 'UserInvites');
//# sourceMappingURL=UserInvites.js.map