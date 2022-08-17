import { resolve } from 'path'
import axios from 'axios'
import { convertCamelCase } from '../../packages/utils/src'
// import { Ora } from 'ora'
import { renderToFile } from '../utils'

const GITHUB_RAW_PROXY_URL = process.env.GITHUB_RAW_PROXY_URL || 'raw.githubusercontent.com'

type ABIArgBaseType = {
  internalType: string
  name: string
  type: 'string' | 'string[]' | 'uint8' | 'uint256' | 'bytes' | 'tuple' | 'tuple[]'
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

type ContractAddressConfiguration = {
  // contract name
  name: string
  abiUrl: string
  addresses: {
    chainId: number
    chainName: string
    // deployed address
    address: string
  }[]
}[]

interface ContractItem {
  title: string
  addresses: Omit<ContractAddressConfiguration[number]['addresses'][number], 'chainName'>[]
  abi: string
  abiArr: ABIItem[]
}

async function fetchContracts(): Promise<ContractItem[]> {
  const res = await axios({
    url: `https://${GITHUB_RAW_PROXY_URL}/comunion-io/comunion-contract/main/contractAddress.json`
  })

  const configurations = res.data as ContractAddressConfiguration

  const contracts: ContractItem[] = []
  for (const element of configurations) {
    const response = await axios({
      url: `https://${GITHUB_RAW_PROXY_URL}/comunion-io/comunion-contract/main${element.abiUrl}`
    })

    const abis = (response.data as { abi: ABIItem[] }).abi.filter(abi => abi.type === 'function')
    contracts.push({
      title: element.name,
      abi: JSON.stringify(abis),
      abiArr: abis,
      addresses: element.addresses.filter(network => !!network.address)
    })
  }
  return contracts
}

// https://raw.githubusercontent.com/comunion-io/comunion-contract/main/contracts/artifacts/Startup.json
// https://raw.githubusercontent.com/comunion-io/comunion-contract/main/contracts/artifacts/Bounty.json
function fetchContractsFromLocal(): ContractItem[] {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const configurations = require('../json/contractAddress.json') as ContractAddressConfiguration
  // const configs = [StartupJson, BountyJson]
  const contracts: ContractItem[] = []
  for (const config of configurations) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const abis = (require(`../json/${config.name}.json`) as { abi: ABIItem[] }).abi.filter(
      abi => abi.type === 'function'
    )
    contracts.push({
      title: config.name,
      abi: JSON.stringify(abis),
      abiArr: abis,
      addresses: config.addresses.filter(network => !!network.address)
    })
  }

  return contracts
}

const contractTypeMap = {
  string: 'string',
  address: 'string',
  bytes: 'string',
  uint256: 'number | BigNumber',
  uint8: 'number',
  'string[]': 'string[]',
  'tuple[]': '[][]',
  tuple: '[]'
} as const

export async function generateContracts() {
  // const ora = await import('ora')
  // const spinner = ora('Parsing contracts').start()
  const contractFolder = resolve(__dirname, '../../packages/web/src/contracts')
  // const contracts = await fetchContracts()
  const contracts = await fetchContractsFromLocal()
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
              if (items.type === 'tuple[]' && items.components) {
                return `${_arg} [${items.components.map(item => loopType(item)).join(', ')}][]`
              }
              return `${_arg} ${contractTypeMap[items.type] || 'any'}`
            }

            return `${acc}${acc.length ? ',' : ''} ${loopType(arg)}`
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
