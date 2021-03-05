/**
 * Convert string to CamelCase format
 * @param originStr Origin string to convert
 * @param firstUpper Upper case the first char or not
 */
export function convertCamelCase(originStr: string, firstUpper = false): string {
  return originStr
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) =>
      idx === 0 ? (firstUpper ? ltr.toUpperCase() : ltr.toLowerCase()) : ltr.toUpperCase()
    )
    .replace(/\s+/g, '')
}
