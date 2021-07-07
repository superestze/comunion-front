import svgPlugin from '@comunion/esbuild-plugin-svg-to-vue3'
import { convertCamelCase } from '@comunion/utils'
import { writeFile } from 'fs'
import { resolve, sep } from 'path'
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
      // 暂不生效
      nameTransform: file => {
        const splited = file.split(sep)
        return `${splited[splited.length - 2]}_${splited[splited.length - 1].replace('.svg', '')}`
      },
      // 作为补充手段，添加/更新入口文件
      async onFinished(result) {
        const distEntryPath = resolve(__dirname, './dist/esm/index.js')
        const distEntryDescriptionPath = resolve(__dirname, './dist/esm/index.d.ts')
        let entryContent = ''
        let entryDescriptionContent = "import type { RenderFunction } from 'vue'\n"
        result.outputFiles.forEach(file => {
          const splited = file.path.split(sep)
          const ComponentName = convertCamelCase(
            `${splited[splited.length - 1].replace('.js', '')}_${splited[splited.length - 2]}`,
            true
          )
          entryContent += `export { default as ${ComponentName} } from './${
            splited[splited.length - 2]
          }/${splited[splited.length - 1].replace('.js', '')}';\n`
          entryDescriptionContent += `declare type ${ComponentName} = { render: RenderFunction }\n`
        })
        writeFile(
          distEntryDescriptionPath,
          entryDescriptionContent,
          { encoding: 'utf-8' },
          () => {}
        )
        writeFile(distEntryPath, entryContent, { encoding: 'utf-8' }, () => {})
      }
    })
  ]
}
