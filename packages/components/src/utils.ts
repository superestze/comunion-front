export const UI_PREFIX_CLASS = 'ui-'

export function addClassPrefix(_class: string) {
  return _class
    .split(' ')
    .map(str => `${UI_PREFIX_CLASS}${str}`)
    .join(' ')
}
