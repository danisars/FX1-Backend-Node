"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationResult = void 0;
class MutationResult {
    constructor(objectType, objectID) {
        this.success = true;
        this.timestamp = new Date().getTime();
        this.objectType = objectType;
        this.objectID = objectID;
    }
}
exports.MutationResult = MutationResult;
//# sourceMappingURL=MutationResult.js.map