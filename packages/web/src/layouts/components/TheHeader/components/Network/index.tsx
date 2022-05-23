import { UDropdown } from '@comunion/components'
import { ArrowDownOutlined } from '@comunion/icons'
import { defineComponent, computed, ref, watchEffect } from 'vue'
import HeaderButton from '../Button'
import styles from './index.module.css'
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

    return () => (
      <UDropdown
        class={styles.dropdown}
        trigger="click"
        value={currentNetwork.value?.chainId}
        placement="bottom-start"
        themeOverrides={{
          optionOpacityDisabled: '0.4'
        }}
        options={[
          {
            type: 'group',
            label: 'Supported network',
            key: 'label',
            children: supportedNetworks.map(network => ({
              key: network.chainId,
              icon: () => <img src={network.logo} class="rounded-full h-5 w-5" />,
              // disabled: network.disabled,
              label: network.shortName ?? network.name
            }))
          }
        ]}
        onSelect={onSelectNetwork}
      >
        <HeaderButton class={ctx.attrs.class}>
          <div class="flex flex-nowrap items-center" ref={btnRef}>
            {networkCache.value && (
              <>
                <img src={networkCache.value?.logo} class="rounded-xl h-5 mr-2 w-5" />
                {networkCache.value?.shortName}
              </>
            )}
            <ArrowDownOutlined class="h-4 ml-2 w-4" />
          </div>
        </HeaderButton>
      </UDropdown>
    )
  }
})

export default NetworkSwitcher
