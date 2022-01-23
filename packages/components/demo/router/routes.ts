import type { RouteRecordRaw } from 'vue-router'

import Layout from '@/ex/layout'
import PaginatedList from '@/ex/views/PaginatedList'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/paginated-list',
        component: PaginatedList
      }
    ]
  }
]

export default routes
