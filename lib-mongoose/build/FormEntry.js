"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormEntry = void 0;
const mongoose_1 = require("mongoose");
const { Mixed } = mongoose_1.Schema.Types;
const schema = new mongoose_1.Schema({
    time: { type: Date, default: () => new Date() },
    type: String,
    actor: String,
    userID: String,
    data: Mixed,
});
schema.index({ type: 1 });
schema.index({ actor: 1 });
schema.index({ userID: 1 });
schema.set('toJSON', { virtuals: true });
exports.FormEntry = (0, mongoose_1.model)('FormEntry', schema, 'FormEntry');
//# sourceMappingURL=FormEntry.js.map