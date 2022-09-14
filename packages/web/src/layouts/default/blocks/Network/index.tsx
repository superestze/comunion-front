import { UButton } from '@comunion/components'
import { ArrowDownOutlined } from '@comunion/icons'
import { defineComponent, computed, ref, watchEffect } from 'vue'
import HeaderDropdown from '../../components/HeaderDropdown'
import { ChainNetworkType } from '@/constants'
import { useWalletStore, useChainStore } from '@/stores'

const NetworkSwitcher = defineComponent({
  name: 'NetworkSwitcher',
  setup(props, ctx) {
    const btnRef = ref<HTMLButtonElement>()
    const walletStore = useWalletStore()
    const networkCache = ref<ChainNetworkType>()
    const chainStore = useChainStore()
    const currentNetwork = computed(() => {
      return chainStore.supportedNetworks.find(
        network => network.chainId === walletStore.chainId ?? 1
      )
    })
    watchEffect(() => {
      if (currentNetwork.value?.chainId) {
        networkCache.value = currentNetwork.value
      }
      if (!networkCache.value) {
        networkCache.value = chainStore.supportedNetworks[0]
      }
    })

    async function onSelectNetwork(chainId: number) {
      await walletStore.ensureWalletConnected()
      walletStore.wallet?.switchNetwork(chainId)
    }

    walletStore.setOpenNetworkSwitcher(() => {
      btnRef.value?.click()
    })

    return () => (
      <HeaderDropdown
        value={currentNetwork.value?.chainId}
        title="Select network"
        options={chainStore.supportedNetworks.map(network => ({
          key: network.chainId,
          // disabled: network.disabled,
          icon: () => <img src={network.logo} class="rounded-full h-5 w-5" />,
          label: (network as ChainNetworkType).shortName ?? network.name
        }))}
        onSelect={onSelectNetwork}
      >
        <UButton
          size="small"
          class="h-8"
          style={{
            '--n-border-radius': '2px',
            '--n-border': '1px solid rgba(218, 220, 224, 1)'
          }}
        >
          <div class="flex flex-nowrap items-center" ref={btnRef}>
            {networkCache.value && (
              <>
                <img src={networkCache.value?.logo} class="rounded-xl h-5 mr-2 w-5" />
                {networkCache.value?.shortName}
              </>
            )}
            <ArrowDownOutlined class="h-4 ml-2 w-4" />
          </div>
        </UButton>
        {/* <HeaderButton class={ctx.attrs.class}></HeaderButton> */}
      </HeaderDropdown>
    )
  }
})

export default NetworkSwitcher
