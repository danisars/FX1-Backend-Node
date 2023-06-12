"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const admin = require("firebase-admin");
const lib_mongoose_1 = require("lib-mongoose");
async function validateToken(token, app) {
    var _a, _b;
    let uid;
    let email;
    let userID;
    let user;
    try {
        user = await (app || admin).auth().verifyIdToken(token);
    }
    catch (e) {
        try {
            // user = await verifyCustomToken(token);
        }
        catch (e) {
            throw new Error('Invalid authentication token.');
        }
    }
    if (user) {
        uid = user.uid;
        email = user.email;
        userID = (_a = user === null || user === void 0 ? void 0 : user.app) === null || _a === void 0 ? void 0 : _a.userID;
        if (!userID) {
            userID = (_b = (await lib_mongoose_1.User.findOne({ uid }).exec())) === null || _b === void 0 ? void 0 : _b.id;
        }
    }
    return {
        uid,
        email,
        userID,
    };
}
exports.validateToken = validateToken;
//# sourceMappingURL=validateToken.js.map