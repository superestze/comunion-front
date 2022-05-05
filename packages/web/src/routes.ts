export const layoutGroupedRoutes = {
  empty: ['/'],
  auth: ['/auth/login', '/auth/callback/*', '/auth/register/*']
  // default: ['*']
} as const
