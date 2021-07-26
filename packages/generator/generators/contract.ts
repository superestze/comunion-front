import { convertCamelCase } from '@comunion/utils'
import ora from 'ora'
import { join, resolve } from 'path'
import { fetch, renderToFile, writeToFile } from '../utils'

interface ContractItem {
  title: string
  address: string
  abi: string
}

async function fetchABIs(spinner: ora.Ora) {
  try {
    const readme = await fetch(
      'https://raw.githubusercontent.com/comunion-io/cos-contract-com/master/README.md'
    )
    const contractLine = readme.match(/# \[Contract & Abi\].+/)
    if (contractLine) {
      const list = readme.slice(contractLine.index! + contractLine[0].length).trim()
      const titles = list.match(/\d+. [\w\d ]+/g)
      const contracts: ContractItem[] = []
      spinner.text = 'Downloading abi jsons'
      for (let i = 0; i < titles!.length - 1; i++) {
        const title = titles![i]
        const contractItem = list
          .slice(
            list.indexOf(title) + title.length,
            i === titles!.length - 1 ? undefined : list.indexOf(titles![i + 1])
          )
          .trim()
        const contractAddr = contractItem.match(/ *- address: (0x[\w\d]+)/)![1]
        const contractABI = contractItem.match(/ *- abi: ([\w\d/]+.json)/)![1]
        if (contractAddr && contractABI) {
          const abi = await fetch(
            join(
              'https://raw.githubusercontent.com/comunion-io/cos-contract-com/master/',
              contractABI
            )
          )
          contracts.push({
            title: title.replace(/\d+\. /, '').trim(),
            abi,
            address: contractAddr
          })
        }
      }
      return contracts
    }
    throw new Error("Readme file format error, can't parse successfully.")
  } catch (error) {
    throw error
  }
}

export async function generaetContracts() {
  const spinner = ora('Parsing contracts').start()
  const contracts = await fetchABIs(spinner)
  spinner.text = 'Writing files'
  for (const contract of contracts) {
    const contractFolder = resolve(__dirname, '../../web/src/hooks/contracts', contract.title)
    await renderToFile(resolve(contractFolder, 'index.ts'), 'contract.tpl', {
      titleUpper: contract.title.toUpperCase(),
      titleHead: convertCamelCase(contract.title, true),
      address: contract.address
    })
    await writeToFile(resolve(contractFolder, 'abi.json'), contract.abi)
  }
  spinner.stop()
}
