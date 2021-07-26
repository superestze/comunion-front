import { ensureFile } from 'fs-extra'
import { readFile, writeFile } from 'fs/promises'
import template from 'lodash.template'
import { resolve } from 'path'

export async function writeToFile(filePath: string, content: string) {
  await ensureFile(filePath)
  await writeFile(filePath, content, {
    encoding: 'utf8'
  })
}

export async function renderToFile(filePath: string, templateFileName: string, data: object) {
  const tpl = await readFile(resolve(__dirname, '../templates', templateFileName), {
    encoding: 'utf-8'
  })
  const content = template(tpl)(data)
  await writeToFile(filePath, content)
}
