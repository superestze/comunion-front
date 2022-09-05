import { CloseOutlined } from '@comunion/icons'
import { NModal } from 'naive-ui'
import type { ExtractPropTypes, PropType } from 'vue'
import { defineComponent, ref } from 'vue'
import './WalletConnect.css'
import IconCoinbaseWallet from './assets/wallet/CoinbaseWallet.png'
import IconMetaMask from './assets/wallet/MetaMask.png'
import IconSafepalWallet from './assets/wallet/SafepalWallet.png'
import IconTokenPocket from './assets/wallet/TokenPocket.png'
import IconTrustWallet from './assets/wallet/TrustWallet.png'
import IconWalletConnect from './assets/wallet/WalletConnect.png'

export const UWalletConnectProps = {
  show: {
    type: Boolean,
    default: false
  },
  onUpdateShow: {
    type: Function as PropType<(v: boolean) => void>
  },
  onClick: {
    type: Function as PropType<
      (
        type:
          | 'MetaMask'
          | 'WalletConnect'
          | 'TrustWallet'
          | 'Coinbase Wallet'
          | 'Safepal Wallet'
          | 'TokenPocket'
      ) => void
    >
  },
  onClose: {
    type: Function as PropType<() => void>
  }
} as const

export type UWalletConnectPropsType = ExtractPropTypes<typeof UWalletConnectProps>

const UWalletConnect = defineComponent({
  name: 'UWalletConnect',
  props: UWalletConnectProps,
  setup(props) {
    interface WalletItem {
      name:
        | 'MetaMask'
        | 'WalletConnect'
        | 'TrustWallet'
        | 'Coinbase Wallet'
        | 'Safepal Wallet'
        | 'TokenPocket'
      icon: string
      allowed: boolean
    }

    const items = ref<WalletItem[]>([
      {
        name: 'MetaMask',
        icon: IconMetaMask,
        allowed: true
      },
      {
        name: 'WalletConnect',
        icon: IconWalletConnect,
        allowed: true
      },
      {
        name: 'TrustWallet',
        icon: IconTrustWallet,
        allowed: true
      },
      {
        name: 'Coinbase Wallet',
        icon: IconCoinbaseWallet,
        allowed: true
      },
      {
        name: 'Safepal Wallet',
        icon: IconSafepalWallet,
        allowed: false
      },
      {
        name: 'TokenPocket',
        icon: IconTokenPocket,
        allowed: false
      }
    ])

    return () => (
      <NModal
        show={props.show}
        onUpdateShow={props.onUpdateShow}
        maskClosable
        onMaskClick={props.onClose}
      >
        <div class="u-wallet-connect">
          <CloseOutlined class="u-wallet-connect__close-icon" onClick={props.onClose} />
          <p class="u-wallet-connect__subtitle">Connect to a wallet</p>
          <div class="u-wallet-connect__wrap flex flex-wrap m-auto">
            {items.value.map(item => (
              <div
                class={`u-wallet-connect__item  p-1rem mt-10px border border-[#EDEDF2] text-center${
                  item.allowed ? ' cursor-pointer' : ' cursor-not-allowed'
                } `}
                onClick={() => {
                  item.allowed && props.onClick?.(item.name)
                }}
              >
                <img src={item.icon} class="u-wallet-connect__item-icon" />
                <div class={`${item.allowed ? '' : 'u-wallet-connect__text-notallowed'}`}>
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </NModal>
    )
  }
})

export default UWalletConnect
