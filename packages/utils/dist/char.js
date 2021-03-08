"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertCamelCase = void 0;
/**
 * Convert string to CamelCase format
 * @param originStr Origin string to convert
 * @param firstUpper Upper case the first char or not
 */
function convertCamelCase(originStr, firstUpper = false) {
    return originStr
        .replace(/^[a-z]/, s => {
        return firstUpper ? s.toUpperCase() : s.toLowerCase();
    })
        .replace(/_[a-zA-Z]/, s => s[1].toUpperCase());
}
exports.convertCamelCase = convertCamelCase;
