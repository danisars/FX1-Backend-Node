"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZipCode = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    zip: { type: String, required: true, unique: true },
    latitude: { type: Number, default: () => 0 },
    longitude: { type: Number, default: () => 0 },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
});
schema.set('toJSON', { virtuals: true });
exports.ZipCode = (0, mongoose_1.model)('ZipCode', schema, 'ZipCode');
//# sourceMappingURL=ZipCode.js.map