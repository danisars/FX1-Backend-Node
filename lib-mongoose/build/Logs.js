"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logs = void 0;
const mongoose_1 = require("mongoose");
const { Mixed } = mongoose_1.Schema.Types;
const schema = new mongoose_1.Schema({
    time: { type: Date, default: () => new Date() },
    type: String,
    logs: Mixed,
});
schema.index({ type: 1 });
schema.set('toJSON', { virtuals: true });
exports.Logs = (0, mongoose_1.model)('Logs', schema, 'Logs');
//# sourceMappingURL=Logs.js.map