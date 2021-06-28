import services from '@/services'
import { defineComponent, ref } from 'vue'
import Web3 from 'web3-eth'

const MetaMaskAuthPage = defineComponent({
  name: 'MetaMaskAuthPage',
  setup() {
    const loading = ref(false)
    const web3Eth = new Web3.Eth(Web3.Eth.givenProvider)

    async function connect() {
      console.log(web3Eth.currentProvider)
      loading.value = true
      const { error, data } = await services['account@获取加密钱包登陆用的Nonce']()
      if (!error) {
        web3Eth.sign(data!.nonce!, web3Eth.coinbase, console.log)
      }
      loading.value = false
    }

    return () => (
      <button disabled={loading.value} onClick={connect}>
        链接 MetaMask
      </button>
    )
  },
})

export default MetaMaskAuthPage
