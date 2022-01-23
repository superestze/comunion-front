export function debounce<F extends (...params: any[]) => void>(fn: F, delay = 300) {
  let timeoutID: NodeJS.Timeout
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutID)
    timeoutID = global.setTimeout(() => fn.apply(this, args), delay)
  } as F
}
