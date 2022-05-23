export const layoutGroupedRoutes = {
  'empty/index': ['/'],
  'auth/index': ['/auth/login', '/auth/callback/*', '/auth/register/*']
  // default: ['*']
} as const
