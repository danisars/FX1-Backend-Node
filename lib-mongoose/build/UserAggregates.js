"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAggregates = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    userID: String,
    supports: { type: Number, default: () => 0 },
});
schema.index({ userID: 1 }, { unique: true });
schema.set('toJSON', { virtuals: true });
schema.static('increment', function (userID, fields) {
    this.updateOne({ userID }, { $inc: fields, $setOnInsert: { userID } }, { upsert: true })
        .exec()
        .then();
});
exports.UserAggregates = (0, mongoose_1.model)('UserAggregates', schema, 'UserAggregates');
//# sourceMappingURL=UserAggregates.js.map