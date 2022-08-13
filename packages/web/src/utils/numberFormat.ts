export function formatToFixed(value: number | string, precision: number) {
  return String(value)
    .toString()
    .replace(/\.(\d+)/, (e, $1) => {
      return `.${$1.substr(0, precision)}`
    })
    .replace(/(?:\.0*|(\.\d+?)0+)$/, '$1')
}
