import { convertCamelCase } from '../../packages/utils/src'
// import { Ora } from 'ora'
import { join, resolve } from 'path'
import { fetch, renderToFile } from '../utils'

const GITHUB_RAW_PROXY_URL = process.env.GITHUB_RAW_PROXY_URL || 'raw.githubusercontent.com'

interface ContractArg {
  internalType: string
  type: string
  name: string
}

interface ContractItem {
  title: string
  address: string
  abi: string
  abiArr: {
    inputs: ContractArg[]
    outputs: ContractArg[]
    name: string
    type: 'function'
  }[]
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
        abiArr: abi,
        address: element.address
      })
    }
    return contracts
  } catch (error) {
    throw error
  }
}

const contractTypeMap = {
  address: 'string',
  uint256: 'number'
} as const

export async function generateContracts(env: string) {
  // const ora = await import('ora')
  // const spinner = ora('Parsing contracts').start()
  const contractFolder = resolve(__dirname, '../../packages/web/src/contracts')
  const contracts = await fetchABIs(env)
  // spinner.text = 'Writing files'
  for (const contract of contracts) {
    await renderToFile(
      resolve(contractFolder, `${convertCamelCase(contract.title)}.ts`),
      'contract.tpl',
      {
        ...contract,
        generateArgs: (args: ContractArg[], withArgName = true): string => {
          return args.reduce<string>((acc, arg, index) => {
            const _arg = withArgName ? `${arg.name || `arg${index}`}: ` : ''
            return `${acc}${acc.length ? ';' : ''} ${_arg} ${
              contractTypeMap[arg.type as keyof typeof contractTypeMap] || 'any'
            }`
          }, '')
        }
      }
    )
  }
  await renderToFile(resolve(contractFolder, 'index.ts'), 'contract.index.tpl', {
    contracts: contracts.map(contract => convertCamelCase(contract.title))
  })
  // spinner.stop()
}
