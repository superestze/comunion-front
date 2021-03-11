import { createRouter, createWebHistory } from 'vue-router'

export default function setupRouter() {
  return createRouter({
    history: createWebHistory('/'),
    routes: [
      {
        path: '/',
        component: () => import('./pages/Welcome'),
      },
      {
        path: '/lib',
        component: () => import('./pages/Library'),
        children: [
          {
            path: 'components/:name',
            component: () => import('./pages/Components'),
          },
        ],
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('./pages/404'),
      },
    ],
  })
}
