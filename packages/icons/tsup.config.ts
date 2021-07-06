import svgPlugin from '@comunion/esbuild-plugin-svg-to-vue3'
import { sep } from 'path'
import type { Options } from 'tsup'

export const tsup: Options = {
  clean: true,
  format: ['esm'],
  outDir: 'dist',
  target: 'es2020',
  legacyOutput: true,
  entryPoints: ['src'],
  external: ['vue'],
  esbuildPlugins: [
    svgPlugin({
      nameTransform: file => {
        const splited = file.split(sep)
        return `${splited[splited.length - 2]}_${splited[splited.length - 1].replace('.svg', '')}`
      }
    })
  ]
}
