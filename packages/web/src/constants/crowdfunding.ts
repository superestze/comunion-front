export const CROWDFUNDING_TYPES = ['Upcoming', 'Live', 'Ended', 'Canceled'] as const
export type CrowdfundingType = typeof CROWDFUNDING_TYPES[number]
