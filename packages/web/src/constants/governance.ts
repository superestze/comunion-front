export const GOVERNANCE_TYPES = ['Upcoming', 'Active', 'Ended', 'Invalid'] as const
export type GovernanceType = typeof GOVERNANCE_TYPES[number]
