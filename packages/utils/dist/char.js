"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertCamelCase = void 0;
/**
 * Convert string to CamelCase format
 * @param originStr Origin string to convert
 */
function convertCamelCase(originStr) {
    return originStr
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) => idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase())
        .replace(/\s+/g, '');
}
exports.convertCamelCase = convertCamelCase;
