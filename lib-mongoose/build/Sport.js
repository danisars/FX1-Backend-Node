"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sport = void 0;
const mongoose_1 = require("mongoose");
const mediaSchema = new mongoose_1.Schema({
    objectType: { type: String, enum: ['Photo', 'Video'] },
    objectID: String,
    isSport: { type: Boolean, default: () => true },
});
const schema = new mongoose_1.Schema({
    createdAt: { type: Number, default: () => new Date().getTime() },
    updatedAt: { type: Number, default: () => new Date().getTime() },
    name: { type: String, required: true, unique: true },
    slug: {
        type: String,
        required: true,
        unique: true,
        enum: [
            'afl',
            'american-football',
            'baseball',
            'basketball',
            'boxing',
            'cricket',
            'football',
            'in-house',
            'mma',
            'nrl',
            'rugby',
            'soccer',
            'sport',
            'tennis',
            'triathlon'
        ],
    },
    Avatar: { type: mediaSchema },
    CoverPhoto: { type: mediaSchema },
    Icon: { type: mediaSchema, default: () => null },
    status: { type: String, default: () => 'Coming Soon' },
    isHidden: { type: Boolean, default: () => false },
});
schema.index({ name: 1 }, { unique: true });
schema.index({ slug: 1 }, { unique: true });
schema.index({ isHidden: 1 });
schema.set('toJSON', { virtuals: true });
exports.Sport = (0, mongoose_1.model)('Sport', schema, 'Sport');
//# sourceMappingURL=Sport.js.map