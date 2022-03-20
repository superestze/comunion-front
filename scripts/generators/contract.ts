import { join, resolve } from 'path'
import { convertCamelCase } from '../../packages/utils/src'
// import { Ora } from 'ora'
import { fetch, renderToFile } from '../utils'

const GITHUB_RAW_PROXY_URL = process.env.GITHUB_RAW_PROXY_URL || 'raw.githubusercontent.com'

type ABIArgBaseType = {
  internalType: string
  name: string
  type: 'string' | 'uint8' | 'uint256' | 'bytes' | 'tuple'
  components?: ABIArgBaseType[]
}

interface ABIItem {
  inputs: ({
    indexed: boolean
  } & ABIArgBaseType)[]
  outputs?: ABIArgBaseType[]
  name?: string
  stateMutability?: string
  type: 'constructor' | 'event' | 'function' | 'fallback' | 'receive' | 'send'
}

interface ContractItem {
  title: string
  address: string
  abi: string
  abiArr: ABIItem[]
}

async function fetchABIs(env: string) {
  const res = await fetch(
    `https://${GITHUB_RAW_PROXY_URL}/comunion-io/comunion-contract/main/contractAddress.json`
  )
  const contractConfig = JSON.parse(res)
  const contracts: ContractItem[] = []
  for (const element of contractConfig[env]) {
    const response = await fetch(
      join(`https://${GITHUB_RAW_PROXY_URL}/comunion-io/comunion-contract/main/${element.abiUrl}`)
    )

    const abis = (JSON.parse(response).abi as ABIItem[]).filter(abi => abi.type === 'function')
    contracts.push({
      title: element.name,
      abi: JSON.stringify(abis),
      abiArr: abis,
      address: element.address
    })
  }
  return contracts
}

const contractTypeMap = {
  string: 'string',
  address: 'string',
  bytes: 'string',
  uint256: 'number',
  uint8: 'number',
  tuple: '[]'
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
        generateArgs: (args: ABIItem['inputs'] = [], isReturn = false): string => {
          return args.reduce<string>((acc, arg, index) => {
            function loopType(items: ABIArgBaseType): string {
              const _arg = isReturn ? `/** ${items.name} */` : `${items.name || `arg${index}`}:`
              if (items.type === 'tuple' && items.components) {
                return `${_arg} [${items.components.map(item => loopType(item)).join(', ')}]`
              }
              return `${_arg} ${contractTypeMap[items.type] || 'any'}`
            }

            return `${acc}${acc.length ? ';' : ''} ${loopType(arg)}`
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
