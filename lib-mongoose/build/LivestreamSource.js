"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivestreamSource = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    _id: { type: String, lowercase: true },
    name: { type: String, required: true, unique: true },
});
schema.set('toJSON', { virtuals: true });
exports.LivestreamSource = (0, mongoose_1.model)('LivestreamSource', schema, 'LivestreamSource');
//# sourceMappingURL=LivestreamSource.js.map