export const CROWDFUNDING_TYPES = ['upcoming', 'live', 'ended', 'cancel'] as const
export type CrowdfundingType = typeof CROWDFUNDING_TYPES[number]
