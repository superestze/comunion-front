import { UButton } from '@comunion/components'
import { ArrowDownOutlined } from '@comunion/icons'
import { defineComponent, computed, ref, watchEffect } from 'vue'
import HeaderDropdown from '../../components/HeaderDropdown'
import notsupport from '@/assets/networks/notsupport.svg'
import { ChainNetworkType, supportedNetworks } from '@/constants'
import { useWalletStore } from '@/stores'

const NetworkSwitcher = defineComponent({
  name: 'NetworkSwitcher',
  setup(props, ctx) {
    const btnRef = ref<HTMLButtonElement>()
    const walletStore = useWalletStore()
    const networkCache = ref<ChainNetworkType>()
    const currentNetwork = computed(() => {
      return supportedNetworks.find(network => network.chainId === walletStore.chainId ?? 1)
    })
    watchEffect(() => {
      if (currentNetwork.value?.chainId) {
        networkCache.value = currentNetwork.value
      }
      if (!networkCache.value) {
        networkCache.value = supportedNetworks[0]
      }
    })

    async function onSelectNetwork(chainId: number) {
      await walletStore.ensureWalletConnected()
      walletStore.wallet?.switchNetwork(chainId)
    }

    walletStore.setOpenNetworkSwitcher(() => {
      btnRef.value?.click()
    })
    const getNetworkNode = () => {
      if (currentNetwork.value?.chainId && networkCache.value) {
        return (
          <>
            <img src={networkCache.value?.logo} class="rounded-xl h-5 mr-2 w-5" />
            {networkCache.value?.name}
          </>
        )
      } else {
        return (
          <>
            <img src={notsupport} class="rounded-xl h-5 mr-2 w-5" />
            {'Not support'}
          </>
        )
      }
    }
    return () => (
      <HeaderDropdown
        value={currentNetwork.value?.chainId}
        title="Select network"
        options={supportedNetworks.map(network => ({
          key: network.chainId,
          // disabled: network.disabled,
          icon: () => <img src={network.logo} class="rounded-full h-5 w-5" />,
          label: network.name ?? (network as ChainNetworkType).shortName
        }))}
        onSelect={onSelectNetwork}
      >
        <UButton size="small" class="h-8 u-h6">
          <div class="flex flex-nowrap items-center u-h6" ref={btnRef}>
            {getNetworkNode()}
            {/* {networkCache.value && (
              <>
                <img src={networkCache.value?.logo} class="rounded-xl h-5 mr-2 w-5" />
                {networkCache.value?.name}
              </>
            )} */}
            <ArrowDownOutlined class="h-4 ml-2 w-4" />
          </div>
        </UButton>
      </HeaderDropdown>
    )
  }
})

export default NetworkSwitcher
