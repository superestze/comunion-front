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
          },
          {
            path: '/form/Dropdown',
            name: 'Dropdown',
            component: () => import('@/ex/views/Dropdown')
          },
          {
            path: '/form/Search',
            name: 'Search',
            component: () => import('@/ex/views/Search')
          }
        ]
      },
      {
        path: '/table',
        name: '表格组件',
        component: RouterView,
        children: [
          {
            path: '/table/pagination',
            name: 'Pagination',
            component: () => import('@/ex/views/Pagination')
          },
          {
            path: '/table/paginated-list',
            name: 'PaginatedList',
            component: () => import('@/ex/views/PaginatedList')
          },
          {
            path: '/table/scroll-list',
            name: 'ScrollList',
            component: () => import('@/ex/views/ScrollList')
          }
        ]
      }
    ]
  }
]

export default routes
