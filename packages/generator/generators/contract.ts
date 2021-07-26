import { convertCamelCase } from '@comunion/utils'
import https from 'https'
import { resolve } from 'path'
import { renderToFile, writeToFile } from '../utils'

function fetchReadMe() {
  return new Promise<string>((resolve, reject) => {
    https.get(
      'https://raw.githubusercontent.com/comunion-io/cos-contract-com/master/README.md',
      res => {
        let data = ''
        res.on('data', chunk => {
          data += chunk
        })
        res.once('end', () => {
          resolve(data)
        })
        res.once('error', e => {
          reject(e)
        })
      }
    )
  })
}

interface ContractItem {
  title: string
  address: string
  abi: string
}

async function fetchABIs() {
  try {
    const readme = await fetchReadMe()
    const contractLine = readme.match(/# \[Contract & Abi\].+/)
    if (contractLine) {
      const list = readme.slice(contractLine.index + contractLine[0].length).trim()
      const titles = list.match(/\d+. [\w\d ]+/g)
      const contracts: ContractItem[] = []
      for (let i = 0; i < titles.length - 1; i++) {
        const title = titles[i]
        const contractItem = list
          .slice(
            list.indexOf(title) + title.length,
            i === titles.length - 1 ? undefined : list.indexOf(titles[i + 1])
          )
          .trim()
        const contractAddr = contractItem.match(/ *- address: (0x[\w\d]+)/)[1]
        const contractABI = contractItem.match(/ *- abi: ([\w\d/]+.json)/)[1]
        if (contractAddr && contractABI) {
          contracts.push({
            title: title.replace(/\d+\. /, '').trim(),
            abi: contractABI,
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
  const contracts = await fetchABIs()
  for (const contract of contracts) {
    const contractFolder = resolve(__dirname, '../../web/src/hooks/contracts', contract.title)
    await renderToFile(resolve(contractFolder, 'index.ts'), 'contract.tpl', {
      titleUpper: contract.title.toUpperCase(),
      titleHead: convertCamelCase(contract.title, true),
      address: contract.address
    })
    // fetch abi json
    await writeToFile(resolve(contractFolder, 'abi.json'), '')
  }
}
