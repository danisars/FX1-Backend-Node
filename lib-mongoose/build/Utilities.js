"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utilities = void 0;
const mongoose_1 = require("mongoose");
const { Mixed } = mongoose_1.Schema.Types;
const schema = new mongoose_1.Schema({
    createdAt: { type: Number, default: () => new Date().getTime() },
    updatedAt: { type: Number, default: () => new Date().getTime() },
    key: { type: String, required: true, unique: true },
    value: { type: Mixed, required: true },
});
schema.index({ key: 1 });
schema.set('toJSON', { virtuals: true });
exports.Utilities = (0, mongoose_1.model)('Utilities', schema, 'Utilities');
//# sourceMappingURL=Utilities.js.map