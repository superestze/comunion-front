import { DemoComponentPlugin } from './plugin/index'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import prismPlugin from 'vite-plugin-prismjs'

import type { UserConfig } from 'vitepress/types/index'

/** @type {import('vitepress/types').UserConfig} */
export default {
  lang: 'en-US',
  title: 'Comunion Frontend Developer',
  description: 'Comunion frontend developer documents',
  locales: {
    '/': {
      lang: 'en-US'
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'Comunion 前端开发者中心',
      description: 'Comunion 前端开发者文档中心'
    }
  },
  themeConfig: {
    repo: 'comunion-io/v5-front',
    docsDir: './',
    // logo: 'logo.png',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',

    locales: {
      '/': {
        selectText: 'Languages',
        label: 'English',
        ariaLabel: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        serviceWorker: {
          updatePopup: {
            message: 'New content is available.',
            buttonText: 'Refresh'
          }
        }
        // algolia: {},
        // nav: [
        //   { text: 'Nested', link: '/nested/', ariaLabel: 'Nested' }
        // ],
        // sidebar: {
        //   '/': [/* ... */],
        //   '/nested/': [/* ... */]
        // }
      },
      '/zh/': {
        selectText: '选择语言',
        label: '简体中文',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '更新于',
        serviceWorker: {
          updatePopup: {
            message: '发现新内容可用.',
            buttonText: '刷新'
          }
        },
        // algolia: {
        //   apiKey: '',
        //   indexName: 'comunion-fe'
        // },
        nav: [
          { text: '开发入门', link: '/zh/guide/getting-started', activeMatch: '^/zh/guide' },
          { text: '组件库', link: '/zh/components/', activeMatch: '^/zh/components' },
          { text: '函数库', link: '/zh/libraries/hooks/useUser', activeMatch: '^/zh/libraries' }
        ],
        sidebar: {
          '/zh/guide/': [
            { text: '快速开始', link: '/zh/guide/getting-started' },
            { text: '编辑器配置', link: '/zh/guide/ide' },
            { text: '开发规范', link: '/zh/guide/specification' },
            { text: '代码结构', link: '/zh/guide/structure' },
            { text: 'Git 规范', link: '/zh/guide/git' },
            { text: '上链交互', link: '/zh/guide/chain' },
            { text: '开发规划', link: '/zh/guide/roadmap' }
          ],
          '/zh/components/': [
            {
              text: '基础',
              children: [
                { text: '全局样式', link: '/zh/components/styles' },
                { text: '图标', link: '/zh/components/icons' },
                { text: '按钮', link: '/zh/components/button' }
              ]
            },
            {
              text: '显示',
              children: []
            },
            {
              text: '排版',
              children: []
            }
          ],
          '/zh/libraries/': [
            {
              text: 'hooks',
              children: [
                { text: '用户', link: '/zh/libraries/hooks/useUser' }
              ]
            },
            {
              text: '函数库',
              children: [
                { text: '链', link: '/zh/libraries/utils/chain' }
              ]
            }
          ]
        }
      }
    }

    // algolia: {
    //   apiKey: 'c57105e511faa5558547599f120ceeba',
    //   indexName: 'vitepress'
    // },
  },
  markdown: {
    config: (md) => {
      md.use(require('markdown-it-task-lists'))
      md.use(DemoComponentPlugin)
      // md.use(HelloComponentPlugin)
    }
  },
  vite: {
    plugins: [
      vueJsx({
        enableObjectSlots: true
      }),
      // prismPlugin({
      //   languages: ['jsx', 'tsx', 'ts'],
      //   css: true,
      //   theme: 'tomorrow'
      // })
    ]
  }
}
