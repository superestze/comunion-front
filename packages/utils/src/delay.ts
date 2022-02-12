export function debounce<F extends (...params: any[]) => void>(fn: F, delay = 300) {
  let timeoutID: NodeJS.Timeout | number
  return function (this: any, ...args: any[]) {
    !!window ? clearTimeout(timeoutID as number) : clearTimeout(timeoutID as NodeJS.Timeout)
    timeoutID = (!!window ? window : global).setTimeout(() => fn.apply(this, args), delay)
  } as F
}
