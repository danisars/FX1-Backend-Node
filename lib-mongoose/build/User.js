"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const mediaSchema = new mongoose_1.Schema({
    objectType: { type: String, enum: ['Photo', 'Video'] },
    objectID: String,
});
const schema = new mongoose_1.Schema({
    createdAt: { type: Number, default: () => new Date().getTime() },
    updatedAt: { type: Number, default: () => new Date().getTime() },
    username: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    uid: { type: String, required: true, unique: true },
    firstName: { type: String, default: () => null },
    lastName: { type: String, default: () => null },
    emailAddress: { type: String, required: true },
    Avatar: { type: mediaSchema, default: () => null },
    online: { type: Boolean, required: true, default: () => false },
    isActive: { type: Boolean, required: true, default: () => true },
    zipCode: { type: String, default: () => null },
});
// schema.virtual('name').get(function (this: UserDocument) {
//   return this.firstName && this.lastName ? `${this.firstName} ${this.lastName}` : `${this.username}`;
// });
schema.index({ username: 1 }, { unique: true });
schema.index({ slug: 1 }, { unique: true });
schema.index({ uid: 1 }, { unique: true });
schema.set('toJSON', { virtuals: true });
exports.User = (0, mongoose_1.model)('User', schema, 'User');
//# sourceMappingURL=User.js.map