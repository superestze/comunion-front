import dayjs from 'dayjs'
/**
 * Bounty types
 */
export const BOUNTY_TYPES = [
  'Created:Recent',
  'Created:Oldest',
  'Value:Highest',
  'Value:Lowest',
  'Deposit:Highest',
  'Deposit:Lowest'
] as const

export const BOUNTY_TYPES_COLOR_MAP = [
  {
    label: 'Ready to work',
    value: '#00BFA5'
  },
  {
    label: 'Work started',
    value: '#5331F4'
  },
  {
    label: 'Completed',
    value: '#DF4F51'
  },
  {
    label: 'Expired',
    value: '#DF4F51'
  }
] as const

export function DateDiff(date: number) {
  let dateValue = ''
  if (dayjs(new Date()).diff(dayjs(date), 'years') > 0) {
    return (dateValue = 'created ' + dayjs(new Date()).diff(dayjs(date), 'years') + ' years ago')
  }
  if (dayjs(new Date()).diff(dayjs(date), 'months') > 0) {
    return (dateValue = 'created ' + dayjs(new Date()).diff(dayjs(date), 'months') + ' months ago')
  }
  if (dayjs(new Date()).diff(dayjs(date), 'days') > 0) {
    return (dateValue = 'created ' + dayjs(new Date()).diff(dayjs(date), 'days') + ' days ago')
  }
  if (dayjs(new Date()).diff(dayjs(date), 'hour') > 0) {
    return (dateValue = 'created ' + dayjs(new Date()).diff(dayjs(date), 'hours') + ' hours ago')
  }
  if (dayjs(new Date()).diff(dayjs(date), 'minutes') > 0) {
    return (dateValue =
      'created ' + dayjs(new Date()).diff(dayjs(date), 'minutes') + ' minutes ago')
  }

  return dateValue
}
