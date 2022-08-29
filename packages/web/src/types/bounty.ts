import { ServiceReturn } from '@/services'

export type BountyItem = NonNullable<ServiceReturn<'bounty@bounty-list(tab)'>>['rows'][number]
