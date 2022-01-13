// @ts-check
import { resolve as pathResolve, dirname, sep } from 'path'
import { build } from 'vite'
import glob from 'fast-glob'
import { fileURLToPath } from 'url'
// import windiCssPlugin from '@luncheon/esbuild-plugin-windicss'
import windiCSS from 'vite-plugin-windicss'
import libInjectCss from './libInjectCss.js'
console.log(libInjectCss)

const resolve = (...args) =>
  pathResolve(
    dirname(
      fileURLToPath(
        // @ts-ignore
        import.meta.url
      )
    ),
    '../',
    ...args
  )

function buildComponent(componentName, isDev) {
  return build({
    // entryPoints: [resolve('src', componentName)],
    // outfile: resolve('dist', componentName, 'index.js'),
    // minify: isProd,
    // bundle: true,
    // target: ['esnext'],
    // format: 'esm',
    // // platform: 'browser',
    // sourcemap: false,
    // external: ['vue', 'naive-ui'],
    // tsconfig: resolve('tsconfig.json'),
    // plugins: [
    //   // @ts-ignore
    //   windiCssPlugin()
    // ]
    // build: {
    //   rollupOptions: {
    //     entryPoints: [resolve('src', componentName)],
    //     outfile: resolve('dist', componentName, 'index.js'),
    //     minify: isProd,
    //     bundle: true,
    //     target: ['esnext'],
    //     format: 'esm',
    //     // platform: 'browser',
    //     sourcemap: false,
    //     external: ['vue', 'naive-ui'],
    //     tsconfig: resolve('tsconfig.json'),
    //   }
    // }
    plugins: [windiCSS(), libInjectCss()],
    build: {
      emptyOutDir: false,
      watch: isDev,
      outDir: resolve('dist', componentName),
      lib: {
        entry: resolve('src', componentName),
        fileName: () => 'index.js',
        formats: ['es']
      },
      rollupOptions: {
        external: ['vue', 'naive-ui']
      }
    }
  })
}

function buildEntry() {
  return build({
    plugins: [windiCSS(), libInjectCss()],
    build: {
      emptyOutDir: false,
      outDir: resolve('dist'),
      lib: {
        entry: resolve('src'),
        fileName: () => 'index.js',
        formats: ['es']
      },
      rollupOptions: {
        external: ['vue', 'naive-ui']
      }
    }
  })
}

;(async () => {
  const isProd = process.env.NODE_ENV === 'production'
  const components = glob.sync('*/index.{ts,tsx}', {
    absolute: false,
    cwd: resolve('src')
  })
  for (const component of components) {
    await buildComponent(component.split(sep)[0], isProd)
  }
  await buildEntry()
})()
