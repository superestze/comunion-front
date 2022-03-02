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
          },
          {
            path: 'dropdown',
            name: 'Dropdown',
            component: () => import('@/ex/views/Dropdown')
          },
          {
            path: 'scrollbar',
            name: 'Scrollbar',
            component: () => import('@/ex/views/Scrollbar')
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
            path: '/form/input-number',
            name: 'InputNumber',
            component: () => import('@/ex/views/InputNumber')
          },
          {
            path: '/form/hash-input',
            name: 'HashInput',
            component: () => import('@/ex/views/HashInput')
          },
          {
            path: 'checkbox',
            name: 'Checkbox',
            component: () => import('@/ex/views/Checkbox')
          },
          {
            path: 'radio',
            name: 'Radio',
            component: () => import('@/ex/views/Radio')
          },
          {
            path: 'date-picker',
            name: 'DatePicker',
            component: () => import('@/ex/views/DatePicker')
          },
          {
            path: 'select',
            name: 'Select',
            component: () => import('@/ex/views/Select')
          },
          {
            path: 'switch',
            name: 'Switch',
            component: () => import('@/ex/views/Switch')
          },
          {
            path: 'slider',
            name: 'Slider',
            component: () => import('@/ex/views/Slider')
          },
          {
            path: 'upload',
            name: 'Upload',
            component: () => import('@/ex/views/Upload')
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
            path: 'pagination',
            name: 'Pagination',
            component: () => import('@/ex/views/Pagination')
          },
          {
            path: 'paginated-list',
            name: 'PaginatedList',
            component: () => import('@/ex/views/PaginatedList')
          },
          {
            path: 'scroll-list',
            name: 'ScrollList',
            component: () => import('@/ex/views/ScrollList')
        ]
      },
      {
        path: '/display',
        name: '展示组件',
        component: RouterView,
        children: [
          {
            path: '/display/card',
            name: 'Card',
            component: () => import('@/ex/views/Card')
          },
          {
            path: 'description',
            name: 'Description',
            component: () => import('@/ex/views/Description')
          },
          {
            path: 'tabs',
            name: 'Tabs',
            component: () => import('@/ex/views/Tabs')
          },
          {
            path: 'image',
            name: 'Image',
            component: () => import('@/ex/views/Image')
          },
          {
            path: 'ellipsis',
            name: 'Ellipsis',
            component: () => import('@/ex/views/Ellipsis')
          },
          {
            path: 'empty',
            name: 'Empty',
            component: () => import('@/ex/views/Empty')
          },
          {
            path: 'skeleton',
            name: 'Skeleton',
            component: () => import('@/ex/views/Skeleton')
          },
          {
            path: 'time',
            name: 'Time',
            component: () => import('@/ex/views/Time')
          }
        ]
      },
      {
        path: '/navs',
        name: '导航组件',
        component: RouterView,
        children: [
          {
            path: 'back-top',
            name: 'BackTop',
            component: () => import('@/ex/views/BackTop')
          }
        ]
      },
      {
        path: '/feedback',
        name: '反馈组件',
        component: RouterView,
        children: [
          {
            path: 'message',
            name: 'Message',
            component: () => import('@/ex/views/Message')
          },
          {
            path: 'loading-bar',
            name: 'LoadingBar',
            component: () => import('@/ex/views/LoadingBar')
          },
          {
            path: 'tooltip',
            name: 'Tooltip',
            component: () => import('@/ex/views/Tooltip')
          }
        ]
      }
    ]
  }
]

export default routes
