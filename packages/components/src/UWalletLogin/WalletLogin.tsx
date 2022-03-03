import type { ExtractPropTypes, PropType } from 'vue'
import { defineComponent } from 'vue'
import { NGrid, NGridItem, NModal } from 'naive-ui'
import { WalletConnectFilled, MetamaskFilled } from '@comunion/icons'
import './index.css'

export const UWalletLoginProps = {
  show: {
    type: Boolean,
    default: false
  },
  onUpdateShow: {
    type: Function as PropType<(v: boolean) => void>
  },
  onMetaMaskLogin: {
    type: Function
  },
  onWalletConnectLogin: {
    type: Function
  }
} as const

export type UWalletLoginPropsType = ExtractPropTypes<typeof UWalletLoginProps>

const UWalletLogin = defineComponent({
  name: 'UWalletLogin',
  props: UWalletLoginProps,
  setup(props) {
    return () => (
      <NModal show={props.show} onUpdateShow={props.onUpdateShow}>
        <div class="u-wallet-login">
          <p class="u-wallet-login__title">Select a Wallet</p>
          <p class="u-wallet-login__subtitle">Please select a wallet to connect to Comunion</p>
          <NGrid xGap={16} yGap={16} cols={2} class="u-wallet-login__wallets">
            <NGridItem>
              <div class="u-wallet-login__wallet" onClick={() => props.onMetaMaskLogin?.()}>
                <MetamaskFilled />
                MetaMask
              </div>
            </NGridItem>
            <NGridItem>
              <div class="u-wallet-login__wallet" onClick={() => props.onWalletConnectLogin?.()}>
                <WalletConnectFilled />
                Wallet Connect
              </div>
            </NGridItem>
          </NGrid>
          <a class="text-primary">What is wallet？</a>
        </div>
      </NModal>
    )
  }
})

export default UWalletLogin
