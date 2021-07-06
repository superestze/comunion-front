// refer to https://github.com/nativew/esbuild-plugin-svg
import { convertCamelCase } from '@comunion/utils'
import { compileTemplate } from '@vue/compiler-sfc'
import type { Plugin } from 'esbuild'
import { readFile } from 'fs'
import path from 'path'
import { optimize } from 'svgo'
import { promisify } from 'util'

/**
 * 优化svg
 */
function optimizeSvg(filename: string, content: string) {
  return optimize(content, {
    path: filename,
    js2svg: {
      indent: 2, // string with spaces or number of spaces. 4 by default
      pretty: true // boolean, false by default
    },
    plugins: ['removeXMLNS']
  }).data
}

/**
 * 转化为vue模板文件
 */
function svgToVueTemplate(filename: string, content: string) {
  const { code } = compileTemplate({
    source: content,
    id: '1',
    filename
  })
  // return code.replace('export function render(', 'export default function render(')
  return code
}

async function transformSvg(filepath: string, targetFileName: string) {
  const content = await promisify(readFile)(filepath, { encoding: 'utf-8' })
  const CamelCaseFilename = convertCamelCase(targetFileName, true)
  console.log('outputFile', CamelCaseFilename)
  const optimized = optimizeSvg(CamelCaseFilename, content)
  const componentCode = svgToVueTemplate(CamelCaseFilename, optimized)
  return componentCode
}

/**
 *
 * @param {String} entryName 添加esm入口
 * @returns esm string
 */
// function addExportEntry(entryName) {
//   return `export { default as ${entryName} } from './${entryName}.js'`
// }

interface SvgTransformOptions {
  nameTransform?: (filePath: string) => string
}

export default function svgPlugin(options: SvgTransformOptions = {}): Plugin {
  return {
    name: 'svg',
    setup(build) {
      const { nameTransform } = options

      build.onLoad({ filter: /\.svg$/ }, async args => {
        const fileName = path.basename(args.path, '.svg')
        console.log('fileName', fileName)
        const outputFile = nameTransform ? nameTransform(args.path) : fileName
        const contents = await transformSvg(args.path, outputFile)
        return { contents, loader: 'tsx' }
      })
      build.on
    }
  }
}
