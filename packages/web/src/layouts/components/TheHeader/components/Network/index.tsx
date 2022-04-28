import { UDropdown, UButton } from '@comunion/components'
import { ArrowDownOutlined } from '@comunion/icons'
import { defineComponent, computed } from 'vue'
import styles from './index.module.css'
import { networks } from '@/constants'
import { useWalletStore } from '@/stores'

const NetworkSwitcher = defineComponent({
  name: 'NetworkSwitcher',
  setup(props, ctx) {
    const walletStore = useWalletStore()

    const currentNetwork = computed(() => {
      return networks.find(network => network.chainId === walletStore.chainId ?? 1)
    })

    return () => (
      <UDropdown
        class={styles.dropdown}
        trigger="click"
        value={currentNetwork.value?.chainId}
        placement="bottom-start"
        options={[
          {
            type: 'group',
            label: 'Select network',
            key: 'label',
            children: networks.map(network => ({
              key: network.chainId,
              icon: () => <img src={network.logo} class="rounded-full h-5 w-5" />,
              disabled: network.disabled,
              label: network.name
            }))
          }
        ]}
      >
        <UButton class={['px-5', ctx.attrs.class]} type="primary" ghost>
          <img src={currentNetwork.value?.logo} class="rounded-xl h-5 mr-2 w-5" />
          {currentNetwork.value?.name}
          <ArrowDownOutlined class="h-4 ml-2 w-4" />
        </UButton>
      </UDropdown>
    )
  }
})

export default NetworkSwitcher
