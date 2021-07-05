import { convertCamelCase } from '@comunion/utils'
import { compileTemplate } from '@vue/compiler-sfc'
import { readdir, readFile, writeFile } from 'fs'
import { join } from 'path'
import { optimize } from 'svgo'
import { promisify } from 'util'

const sourceDir = join(__dirname, '../src')
const outlinedDir = join(sourceDir, 'outlined')
const filledDir = join(sourceDir, 'filled')
const targetDir = join(__dirname, '../dist')

function optimizeSvg(filename: string, content: string): string {
  return optimize(content, {
    path: filename,
    js2svg: {
      indent: 2, // string with spaces or number of spaces. 4 by default
      pretty: true // boolean, false by default
    },
    plugins: ['removeXMLNS']
  }).data
}

function compileSvg(filename: string, content: string) {
  const { code } = compileTemplate({
    source: content,
    id: '1',
    filename
  })
  return code.replace('export function render(', 'export default function render(')
}

async function buildType(suffix: string, dirPath: string, filename: string) {
  const svgFile = join(dirPath, filename)
  const content = await promisify(readFile)(svgFile, { encoding: 'utf-8' })
  const CamelCaseFilename = convertCamelCase(filename, true)
  const optimized = optimizeSvg(CamelCaseFilename, content)
  const componentCode = compileSvg(CamelCaseFilename, optimized)
  await promisify(writeFile)(
    join(targetDir, CamelCaseFilename.replace(/\.svg/, `${suffix}.esm.js`)),
    componentCode,
    {
      encoding: 'utf-8'
    }
  )
  return CamelCaseFilename.replace(/\.svg/, suffix)
}

function addExportEntry(entryName: string) {
  return `export { default as ${entryName} } from './${entryName}.esm.js'`
}

async function build() {
  const exportEntries = []
  let svgs = await promisify(readdir)(outlinedDir)
  for (const svg of svgs) {
    if (svg !== '.gitkeep') {
      exportEntries.push(addExportEntry(await buildType('Outlined', outlinedDir, svg)))
    }
  }
  svgs = await promisify(readdir)(filledDir)
  for (const svg of svgs) {
    if (svg !== '.gitkeep') {
      exportEntries.push(addExportEntry(await buildType('Filled', filledDir, svg)))
    }
  }
  await promisify(writeFile)(join(targetDir, 'index.esm.js'), exportEntries.join('\n'), {
    encoding: 'utf-8'
  })
}

build()
