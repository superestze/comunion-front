export function formatToFloor(value: number, precision: number) {
  return Math.floor(value * Math.pow(10, precision)) / Math.pow(10, precision)
}

export function formatToFixed(value: number, precision: number) {
  return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision)
}
