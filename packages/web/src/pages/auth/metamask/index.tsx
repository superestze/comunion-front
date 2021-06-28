import { defineComponent } from 'vue'

const MetaMaskAuthPage = defineComponent({
  name: 'MetaMaskAuthPage',
  setup() {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!')
      console.log(window.ethereum.networkVersion)
      console.log(window.ethereum.selectedAddress)
    }
    return () => <div></div>
  },
})

export default MetaMaskAuthPage
