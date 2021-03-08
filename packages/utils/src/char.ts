/**
 * Convert string to CamelCase format
 * @param originStr Origin string to convert
 * @param firstUpper Upper case the first char or not
 */
export function convertCamelCase(originStr: string, firstUpper = false): string {
  return originStr
    .replace(/^[a-z]/, s => {
      return firstUpper ? s.toUpperCase() : s.toLowerCase()
    })
    .replace(/_[a-zA-Z]/, s => s[1].toUpperCase())
}
