"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamePartner = void 0;
const mongoose_1 = require("mongoose");
const mediaSchema = new mongoose_1.Schema({
    objectType: { type: String, enum: ['Photo', 'Video'] },
    objectID: String,
    isSport: { type: Boolean, default: () => true },
});
const schema = new mongoose_1.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    Icon: { type: mediaSchema, default: () => null },
    Logo: { type: mediaSchema, default: () => null },
    isHidden: { type: Boolean, default: () => false },
});
schema.index({ slug: 1 }, { unique: true });
schema.set('toJSON', { virtuals: true });
exports.GamePartner = (0, mongoose_1.model)('GamePartner', schema, 'GamePartner');
//# sourceMappingURL=GamePartner.js.map