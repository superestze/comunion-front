import type { RouteRecordRaw } from 'vue-router'
import { RouterView } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/ex/layout'),
    children: [
      {
        path: '/base',
        name: '基础组件',
        component: RouterView,
        children: [
          {
            path: '/base/button',
            name: 'Button',
            component: () => import('@/ex/views/Button')
          }
        ]
      },
      {
        path: '/form',
        name: '表单组件',
        component: RouterView,
        children: [
          {
            path: '/form/input',
            name: 'Input',
            component: () => import('@/ex/views/Input')
          },
          {
            path: '/form/hash-input',
            name: 'HashInput',
            component: () => import('@/ex/views/HashInput')
          },
          {
            path: '/form/factory',
            name: 'FormFactory',
            component: () => import('@/ex/views/Form/Factory')
          }
        ]
      },
      {
        path: '/navs',
        name: '导航组件',
        component: RouterView,
        children: [
          {
            path: '/navs/pagination',
            name: 'Pagination',
            component: () => import('@/ex/views/Pagination')
          },
          {
            path: '/navs/paginated-list',
            name: 'PaginatedList',
            component: () => import('@/ex/views/PaginatedList')
          }
        ]
      }
    ]
  }
]

export default routes
