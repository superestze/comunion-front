export const layoutGroupedRoutes = {
  'empty/index': ['/'],
  'auth/index': ['/auth/login', '/auth/callback/*', '/auth/register/*', '/auth/association'],
  'fluent/index': ['/startup/list']
  // default: ['*']
} as const
