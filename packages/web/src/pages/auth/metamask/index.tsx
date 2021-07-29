import { useEther } from '@/hooks'
import services from '@/services'
import { utils } from 'ethers'
import { defineComponent } from 'vue'

const MetaMaskAuthPage = defineComponent({
  name: 'MetaMaskAuthPage',
  setup() {
    const { getSigner, address, loading, setProvider, onConnect } = useEther()
    setProvider(window.ethereum)
    const connect = () => {
      onConnect(async () => {
        await window.ethereum.enable()
        const resN = await services['account@获取加密钱包登陆用的Nonce']({
          address: address.value
        })
        if (!resN.error) {
          const signature = await getSigner()!.signMessage(resN.data!.nonce!)
          if (signature) {
            const { error, data } = await services['account@ETH钱包登陆（metamask）']({
              address: address.value,
              signature,
              message_hash: utils.hashMessage(resN.data!.nonce!)
            })
            if (!error) {
              console.log(data)
              return true
            }
          }
        }
        return false
      })
    }
    return () => (
      <>
        <button disabled={loading.value} onClick={connect}>
          链接 MetaMask
        </button>
        {address.value && <span>钱包地址：{address.value}</span>}
      </>
    )
  }
})

export default MetaMaskAuthPage
