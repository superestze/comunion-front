import { convertCamelCase } from '../../packages/utils/src'
// import { Ora } from 'ora'
import { join, resolve } from 'path'
import { fetch, renderToFile } from '../utils'

const GITHUB_RAW_PROXY_URL = process.env.GITHUB_RAW_PROXY_URL || 'raw.githubusercontent.com'

interface ContractItem {
  title: string
  address: string
  abi: string
}

async function fetchABIs(env: string) {
  try {
    const res = await fetch(
      `https://${GITHUB_RAW_PROXY_URL}/comunion-io/comunion-contract/main/contractAddress.json`
    )
    const contractConfig = JSON.parse(res)
    const contracts: ContractItem[] = []
    for (const element of contractConfig[env]) {
      const response = await fetch(
        join(`https://${GITHUB_RAW_PROXY_URL}/comunion-io/comunion-contract/main/${element.abiUrl}`)
      )

      const { abi } = JSON.parse(response)
      contracts.push({
        title: element.name,
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
    const contractFolder = resolve(
      __dirname,
      '../../web/src/contracts',
      `${convertCamelCase(contract.title)}.ts`
    )
    await renderToFile(resolve(contractFolder), 'contract.tpl', {
      title: contract.title,
      abi: contract.abi,
      address: contract.address
    })
  }
  await renderToFile(
    resolve(__dirname, '../../web/src/contracts', 'index.ts'),
    'contract.index.tpl',
    {
      contracts: contracts.map(contract => convertCamelCase(contract.title))
    }
  )
  // spinner.stop()
}
