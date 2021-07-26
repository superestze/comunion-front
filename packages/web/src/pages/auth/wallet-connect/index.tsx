import { useEther } from '@/hooks'
import WalletConnectProvider from '@walletconnect/ethereum-provider'
import { defineComponent } from 'vue'

const WalletCollectPage = defineComponent({
  name: 'WalletCollectPage',
  setup() {
    const { address, loading, setProvider, onConnect } = useEther()
    setProvider(async () => {
      return new WalletConnectProvider({
        chainId: 5
      })
    })
    const connect = () => {
      onConnect(async () => {
        // TODO
        return Promise.resolve(true)
      })
    }
    return () => (
      <>
        <button disabled={loading.value} onClick={connect}>
          链接 WallectCollect
        </button>
        {address.value && <span>钱包地址：{address.value}</span>}
      </>
    )
  }
})

export default WalletCollectPage
