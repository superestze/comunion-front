import { convertCamelCase } from '../../packages/utils/src'
// import { Ora } from 'ora'
import { join, resolve } from 'path'
import { fetch, renderToFile } from '../utils'

interface ContractItem {
  title: string
  address: string
  abi: string
}

async function fetchABIs(env: string) {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/comunion-io/comunion-contract/main/contractAddress.json'
    )
    const contractConfig = JSON.parse(res)
    const contracts: ContractItem[] = []
    for (const element of contractConfig[env]) {
      const response = await fetch(
        join(
          'https://raw.githubusercontent.com/comunion-io/comunion-contract/main/',
          element.abiUrl
        )
      )

      const { abi } = JSON.parse(response)
      contracts.push({
        title: convertCamelCase(element.name),
        abi: JSON.stringify(abi),
        address: element.address
      })
    }
    return contracts
  } catch (error) {
    throw error
  }
}

export async function generateContracts(env: string) {
  // const ora = await import('ora')
  // const spinner = ora('Parsing contracts').start()
  const contracts = await fetchABIs(env)
  // spinner.text = 'Writing files'
  for (const contract of contracts) {
    const contractFolder = resolve(__dirname, '../../web/src/contracts', contract.title)
    await renderToFile(resolve(contractFolder, 'index.ts'), 'contract.tpl', {
      abi: contract.abi,
      address: contract.address
    })
  }
  await renderToFile(resolve(__dirname, '../../web/src/', 'index.ts'), 'contract.index.tpl', {
    contracts: contracts.map(contract => contract.title)
  })
  // spinner.stop()
}
