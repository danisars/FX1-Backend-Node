"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CMSUser = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    createdAt: { type: Number, default: () => new Date().getTime() },
    updatedAt: { type: Number, default: () => new Date().getTime() },
    slug: String,
    firstName: String,
    lastName: String,
    contactNumber: String,
    jobTitle: String,
    country: String,
    birthDate: String,
    profilePhotoID: String,
    uid: String,
    email: String,
    displayName: String,
    accessLevel: String,
    invitedBy: String,
});
schema.virtual('name').get(function () {
    return `${this.firstName} ${this.lastName}`;
});
schema.index({ CMSUsername: 1 }, { unique: true });
schema.index({ slug: 1 }, { unique: true });
schema.index({ uid: 1 }, { unique: true });
schema.set('toJSON', { virtuals: true });
exports.CMSUser = (0, mongoose_1.model)('CMSUser', schema, 'CMSUser');
//# sourceMappingURL=CMSUser.js.map