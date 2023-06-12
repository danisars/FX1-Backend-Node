"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockerRoom = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    createdAt: { type: Number, default: () => new Date().getTime() },
    updatedAt: { type: Number, default: () => new Date().getTime() },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    group: { type: String, required: true },
});
schema.index({ group: 1 }, { unique: true });
schema.index({ slug: 1 }, { unique: true });
schema.set('toJSON', { virtuals: true });
exports.LockerRoom = (0, mongoose_1.model)('LockerRoom', schema, 'LockerRoom');
//# sourceMappingURL=LockerRoom.js.map