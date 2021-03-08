import { join } from 'path'
import { mkdir, readFile, writeFile } from 'fs'
import { promisify } from 'util'
import template from 'lodash.template'
import { convertCamelCase } from '@comunion/utils'

export default async function run(name: string) {
  if (!name) {
    throw new Error('Please specify the component name.')
  }
  const tpl = await promisify(readFile)(join(__dirname, '../templates/component.tpl'), {
    encoding: 'utf-8',
  })
  const componentName = convertCamelCase(name, true)
  const componentDir = join(__dirname, '../../components/src', componentName)
  await promisify(mkdir)(componentDir)
  await promisify(writeFile)(
    join(componentDir, 'index.tsx'),
    template(tpl)({ name: componentName }),
    { encoding: 'utf-8' }
  )
  await promisify(writeFile)(join(componentDir, 'index.css'), `/** ${componentName} */`, {
    encoding: 'utf-8',
  })
  console.log(`Component: ${componentName} folder generated in ${componentDir} !`)
}
