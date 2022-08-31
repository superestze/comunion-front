import { ServiceReturn } from '@/services'

export type CrowdfundingItem = NonNullable<
  ServiceReturn<'crowdfunding@public-crowdfunding-list'>
>['rows'][number]
