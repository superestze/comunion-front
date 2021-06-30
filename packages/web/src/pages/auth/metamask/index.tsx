import { useEthInject } from '@/providers/EthProvider'
import services from '@/services'
import { utils } from 'ethers'
import { defineComponent, ref } from 'vue'

const MetaMaskAuthPage = defineComponent({
  name: 'MetaMaskAuthPage',
  setup() {
    const loading = ref(false)
    const eth = useEthInject()

    async function connect() {
      loading.value = true
      await eth.connectMetamask()
      console.log(eth)
      const resN = await services['account@获取加密钱包登陆用的Nonce']({
        address: eth.address.value
      })
      if (!resN.error) {
        const signature = await eth.signer.signMessage(resN.data!.nonce!)
        if (signature) {
          const { error, data } = await services['account@ETH钱包登陆（metamask）']({
            address: eth.address.value,
            signature,
            message_hash: utils.hashMessage(resN.data!.nonce!)
          })
          if (!error) {
            console.log(data)
          }
        }
      }
      loading.value = false
    }

    return () => (
      <button disabled={loading.value} onClick={connect}>
        链接 MetaMask
      </button>
    )
  }
})

export default MetaMaskAuthPage
