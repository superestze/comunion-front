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
