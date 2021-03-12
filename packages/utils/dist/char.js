"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertCamelCase = void 0;
/**
 * Convert string to CamelCase format
 * @param originStr Origin string to convert
 * @param firstUpper Upper case the first char or not
 */
function convertCamelCase(originStr, firstUpper) {
    if (firstUpper === void 0) { firstUpper = false; }
    return originStr
        .replace(/^[a-z]/, function (s) {
        return firstUpper ? s.toUpperCase() : s.toLowerCase();
    })
        .replace(/_[a-zA-Z]/, function (s) { return s[1].toUpperCase(); });
}
exports.convertCamelCase = convertCamelCase;
