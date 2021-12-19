import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import polyfillNode from 'rollup-plugin-polyfill-node'
import { defineConfig } from 'vite'
import pages from 'vite-plugin-pages'
import WindiCSS from 'vite-plugin-windicss'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src')
    }
  },
  server: {
    proxy: {
      '/api': 'https://api.d.comunion.io'
    }
  },
  // define: {
  //   global: {}
  // },
  // optimizeDeps: {
  //   include: ['bn.js', 'hash.js']
  // },
  plugins: [
    vue(),
    vueJsx({
      // enableObjectSlots: true
    }),
    WindiCSS(),
    pages({
      extensions: ['tsx'],
      pagesDir: 'src/pages',
      exclude: ['**/components/**/*.*', '**/blocks/**/*.*'],
      importMode: 'async',
      nuxtStyle: true
    }),
    polyfillNode()
  ]
})
