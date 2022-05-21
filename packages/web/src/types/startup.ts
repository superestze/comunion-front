import { ServiceReturn } from '@/services'

export type StartupItem = NonNullable<ServiceReturn<'startup@startup-list'>>['list'][number]
