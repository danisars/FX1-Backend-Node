"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupAggregates = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    group: String,
    leagues: { type: Number, default: () => 0 },
    clubs: { type: Number, default: () => 0 },
    channelGroups: { type: Number, default: () => 0 },
    channels: { type: Number, default: () => 0 },
    supporters: { type: Number, default: () => 0 },
    fanGroups: { type: Number, default: () => 0 },
    inHouses: { type: Number, default: () => 0 },
});
schema.index({ group: 1 }, { unique: true });
schema.set('toJSON', { virtuals: true });
schema.static('increment', function (group, fields) {
    this.updateOne({ group }, { $inc: fields, $setOnInsert: { group } }, { upsert: true })
        .exec()
        .then();
});
exports.GroupAggregates = (0, mongoose_1.model)('GroupAggregates', schema, 'GroupAggregates');
//# sourceMappingURL=GroupAggregates.js.map