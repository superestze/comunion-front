/**
 * Convert string to CamelCase format
 * @param originStr Origin string to convert
 */
export function convertCamelCase(originStr) {
    return originStr
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (ltr, idx) {
        return idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase();
    })
        .replace(/\s+/g, '');
}
//# sourceMappingURL=char.js.map