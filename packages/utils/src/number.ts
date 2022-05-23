export function formatNumber(data: number, separator = ' ') {
  const [intPart] = data.toString().split('.')
  const reverseArr = intPart.split('').reverse()
  const groupUnit = 3
  let result = ''
  for (let index = 0; index < reverseArr.length; index++) {
    if (index !== 0 && index % groupUnit === 0) {
      result = separator + result
    }
    result = reverseArr[index] + result
  }
  return result
}
