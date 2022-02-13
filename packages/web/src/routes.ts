export const layoutGroupedRoutes = {
  empty: ['/', '/auth/login', '/auth/callback/*'],
  common: ['/auth/register/*']
  // default: ['*']
} as const
