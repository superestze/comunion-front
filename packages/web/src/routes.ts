export const layoutGroupedRoutes = {
  'empty/index': ['/'],
  'auth/index': ['/auth/login', '/auth/callback/*', '/auth/register/*', '/auth/association']
  // default: ['*']
} as const
