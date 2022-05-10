import { WalletConnectFilled, MetamaskFilled, CloseOutlined } from '@comunion/icons'
import { NGrid, NGridItem, NModal } from 'naive-ui'
import type { ExtractPropTypes, PropType } from 'vue'
import { defineComponent } from 'vue'
import './WalletConnect.css'

export const UWalletConnectProps = {
  show: {
    type: Boolean,
    default: false
  },
  onUpdateShow: {
    type: Function as PropType<(v: boolean) => void>
  },
  onClick: {
    type: Function as PropType<(type: 'MetaMask' | 'WalletConnect') => void>
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
    return () => (
      <NModal
        show={props.show}
        onUpdateShow={props.onUpdateShow}
        maskClosable
        onMaskClick={props.onClose}
      >
        <div class="u-wallet-connect">
          <CloseOutlined class="u-wallet-connect__close-icon" onClick={props.onClose} />
          <p class="u-wallet-connect__subtitle">
            please connect your MeteMask or scan with WalletConnect
          </p>
          <NGrid xGap={16} yGap={16} cols={2} class="u-wallet-connect__wallets">
            <NGridItem>
              <div class="u-wallet-connect__wallet" onClick={() => props.onClick?.('MetaMask')}>
                <MetamaskFilled />
                MetaMask
              </div>
            </NGridItem>
            <NGridItem>
              {/*TODO zehui: after this OK, please uncomment this*/}
              {/*<div*/}
              {/*  class="u-wallet-connect__wallet"*/}
              {/*  onClick={() => props.onClick?.('WalletConnect')}*/}
              {/*>*/}
              <div class="u-wallet-connect__wallet u-not-allow">
                <WalletConnectFilled />
                Wallet Connect
              </div>
            </NGridItem>
          </NGrid>
          {/* <a class="text-primary">What is wallet？</a> */}
        </div>
      </NModal>
    )
  }
})

export default UWalletConnect
