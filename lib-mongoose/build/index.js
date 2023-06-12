"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports.connect = exports.connection = void 0;
const mongoose_1 = require("mongoose");
var mongoose_2 = require("mongoose");
Object.defineProperty(exports, "connection", { enumerable: true, get: function () { return mongoose_2.connection; } });
function connect(params) {
    (0, mongoose_1.set)('strictQuery', true);
    return (0, mongoose_1.connect)((params === null || params === void 0 ? void 0 : params.url) || process.env.MONGODB_URI, Object.assign({
        useNewUrlParser: true,
        useUnifiedTopology: true,
        keepAlive: true,
    }, (params === null || params === void 0 ? void 0 : params.options) || {}));
}
exports.connect = connect;
function disconnect() {
    return (0, mongoose_1.disconnect)();
}
exports.disconnect = disconnect;
__exportStar(require("./User"), exports);
__exportStar(require("./League"), exports);
__exportStar(require("./Club"), exports);
__exportStar(require("./Sport"), exports);
__exportStar(require("./ChannelGroup"), exports);
__exportStar(require("./Channel"), exports);
__exportStar(require("./CMSUser"), exports);
__exportStar(require("./UserRole"), exports);
__exportStar(require("./UserRoleType"), exports);
__exportStar(require("./GroupAggregates"), exports);
__exportStar(require("./UserAggregates"), exports);
__exportStar(require("./FormEntry"), exports);
__exportStar(require("./Logs"), exports);
__exportStar(require("./LockerRoom"), exports);
__exportStar(require("./Message"), exports);
__exportStar(require("./UserInvites"), exports);
__exportStar(require("./ReadMessage"), exports);
__exportStar(require("./FanGroup"), exports);
__exportStar(require("./ProfileAction"), exports);
__exportStar(require("./Notification"), exports);
__exportStar(require("./Livestream"), exports);
__exportStar(require("./LivestreamSource"), exports);
__exportStar(require("./Utilities"), exports);
__exportStar(require("./InHouse"), exports);
__exportStar(require("./Game"), exports);
__exportStar(require("./GameReminder"), exports);
__exportStar(require("./ZipCode"), exports);
__exportStar(require("./GamePartner"), exports);
__exportStar(require("./GameReminder"), exports);
// export * from './SystemChannelGroup';
// export * from './SystemChannel';
//# sourceMappingURL=index.js.map