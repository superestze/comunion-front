import { ServiceReturn } from '@/services'

export const CROWDFUNDING_TYPES = ['Upcoming', 'Live', 'Ended', 'Canceled'] as const
export type CrowdfundingType = typeof CROWDFUNDING_TYPES[number]

export type CrowdfundingItemType = NonNullable<
  NonNullable<ServiceReturn<'crowdfunding@public-crowdfunding-list'>>['rows']
>[number]
