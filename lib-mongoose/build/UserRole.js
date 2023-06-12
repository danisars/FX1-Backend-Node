"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    createdAt: { type: Number, default: () => new Date().getTime() },
    updatedAt: { type: Number, default: () => new Date().getTime() },
    group: { type: String, required: true },
    groupType: {
        type: String,
        required: true,
        enum: ['Club', 'League', 'FanGroup', 'InHouse', 'Channel'],
    },
    groupID: { type: String, required: true },
    userID: { type: String, required: true },
    uid: { type: String, required: true },
    lockerRoomID: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, required: true },
    isPrimaryOwner: { type: Boolean, default: () => false },
});
schema.index({ groupType: 1 });
schema.index({ groupType: 1, role: 1 });
schema.index({ group: 1 });
schema.index({ group: 1, role: 1 });
schema.index({ uid: 1, group: 1, role: 1 }, { unique: true });
schema.index({ lockerRoomID: 1, groupType: 1 });
schema.index({ userID: 1, lockerRoomID: 1 });
schema.index({ uid: 1, lockerRoomID: 1 });
schema.index({ lockerRoomID: 1, uid: 1 });
schema.set('toJSON', { virtuals: true });
exports.UserRole = (0, mongoose_1.model)('UserRole', schema, 'UserRole');
//# sourceMappingURL=UserRole.js.map