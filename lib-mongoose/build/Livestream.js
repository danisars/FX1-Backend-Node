"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Livestream = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    createdAt: { type: Number, default: () => new Date().getTime() },
    updatedAt: { type: Number, default: () => new Date().getTime() },
    title: { type: String, required: true },
    link: { type: String, required: true },
    source: { type: String, required: true },
    startDate: { type: String },
    timezone: { type: String },
    isLive: { type: Boolean, default: () => false },
});
schema.set('toJSON', { virtuals: true });
exports.Livestream = (0, mongoose_1.model)('Livestream', schema, 'Livestream');
//# sourceMappingURL=Livestream.js.map