// import WalletConnectProvider from '@walletconnect/ethereum-provider'
// import { providers } from 'ethers'
import { defineComponent } from 'vue'

const WalletCollectPage = defineComponent({
  name: 'WalletCollectPage',
  setup() {
    // const wcProvider = new WalletConnectProvider({
    //   chainId: 5
    // })
    // console.log(wcProvider)
    //  Wrap with Web3Provider from ethers.js
    // const provider = new providers.Web3Provider(wcProvider)
    // const signer = provider.getSigner()
    // window.provider = provider
    // async function connectMetamask() {
    //   await wcProvider.enable()
    //   const addr = await signer.getAddress()
    //   console.log(addr)
    // }
    const connectMetamask = () => {}
    return () => <button onClick={connectMetamask}>链接 WallectCollect</button>
  }
})

export default WalletCollectPage
