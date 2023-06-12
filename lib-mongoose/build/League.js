"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.League = void 0;
const mongoose_1 = require("mongoose");
const mediaSchema = new mongoose_1.Schema({
    objectType: { type: String, enum: ['Photo', 'Video'] },
    objectID: String,
});
const schema = new mongoose_1.Schema({
    createdAt: { type: Number, default: () => new Date().getTime() },
    updatedAt: { type: Number, default: () => new Date().getTime() },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sportIDs: { type: [String], default: () => [] },
    Avatar: { type: mediaSchema, default: () => null },
    CoverPhoto: { type: mediaSchema, default: () => null },
    isFeatured: { type: Boolean, default: () => false },
    boost: { type: Number, default: () => 0 },
});
schema.index({ sportIDs: 1, name: 1 }, { unique: true });
schema.index({ slug: 1 }, { unique: true });
schema.set('toJSON', { virtuals: true });
exports.League = (0, mongoose_1.model)('League', schema, 'League');
//# sourceMappingURL=League.js.map