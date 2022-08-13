export const CROWDFUNDING_TYPES = ['UPCOMING', 'LIVE', 'ENDED', 'CANCELED'] as const
export type CrowdfundingType = typeof CROWDFUNDING_TYPES[number]
