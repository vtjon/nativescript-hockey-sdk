"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var INSTANCE;
function getInstance(T) {
    if (!INSTANCE) {
        INSTANCE = new T();
    }
    return INSTANCE;
}
exports.getInstance = getInstance;
