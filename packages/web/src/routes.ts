export const layoutGroupedRoutes = {
  'empty/index': ['/ipfs/raw/*'],
  'auth/index': ['/auth/login', '/auth/callback/*', '/auth/register/*', '/auth/association']
  // default: ['*']
} as const
