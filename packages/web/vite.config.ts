import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
// import polyfillNode from 'rollup-plugin-polyfill-node'
import { defineConfig } from 'vite'
import pages from 'vite-plugin-pages'
import WindiCSS from 'vite-plugin-windicss'
// import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
      '@walletconnect/web3-provider': path.resolve(
        __dirname,
        '../../node_modules/@walletconnect/web3-provider/dist/umd/index.min.js'
      )
    }
  },
  server: {
    proxy: {
      '/api': 'https://api.d.comunion.io'
    }
  },
  define: {
    'process.env.NODE_DEBUG': false
  },
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
      exclude: ['**/components/**/*.*', '**/blocks/**/*.*', '**/hooks/**/*.*', '**/_*.*'],
      importMode: 'async',
      nuxtStyle: true
    })
    // polyfillNode()
  ],
  build: {
    rollupOptions: {
      output: {
        // manualChunks: {
        //   wallet: ['@walletconnect/web3-provider'],
        //   ethers: ['ethers'],
        //   vue: ['vue', 'vue-router', 'pinia'],
        //   tools: ['axios', 'buffer', 'events', 'util']
        // }
        manualChunks(id) {
          const chunkMap = {
            '@walletconnect/web3-provider': 'wallet',
            '@ethersproject': 'ethers',
            ethers: 'ethers',
            vue: 'vue',
            'vue-router': 'vue',
            pinia: 'vue',
            axios: 'tools',
            buffer: 'tools',
            events: 'tools',
            util: 'tools'
          }
          const splited = id.split('node_modules' + path.sep)
          if (splited.length > 1) {
            let pkgName
            if (splited[1].startsWith('@')) {
              pkgName = splited[1].split('/').slice(0, 2).join('/')
            } else {
              pkgName = splited[1].split('/')[0]
            }
            if (
              Object.keys(chunkMap).includes(pkgName) ||
              (pkgName.startsWith('@') &&
                Object.keys(chunkMap).find(key => pkgName.startsWith(key)))
            ) {
              return chunkMap[pkgName]
            }
            return 'bundle'
          }
        }
      }
    }
  }
})
