import axios from 'axios'

const etherscanApiKey: string =
  (import.meta.env.VITE_ETHERSCAN_API_KEY as string) ?? 'M6CJEAZ7U6HSHAY1G2D84AK5C2S5U134JR'

let currentNetwork = 'Mainnet'

export function setNetwork(network: 'Mainnet' | 'Goerli') {
  currentNetwork = network
}

function getEndpintUrl() {
  switch (currentNetwork) {
    case 'Goerli':
      return 'https://api-goerli.etherscan.io/'
    // 'Mainnet':
    default:
      return 'https://api.etherscan.io/'
  }
}

export function getTokenInfo(tokenAddress: string) {
  axios.get('', {
    baseURL: getEndpintUrl(),
    data: {
      apikey: etherscanApiKey
    }
  })
}
