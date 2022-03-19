import { UWalletConnect, UWalletConnectPropsType } from '@comunion/components'
import { defineComponent } from 'vue'
import { useOnLoggedIn } from '@/hooks'
import { useWallet } from '@/providers'
import { UserResponse } from '@/types'
const WalletConnectBlock = defineComponent({
  name: 'WalletConnectBlock',
  props: {
    visible: {
      type: Boolean
    },
    onConnected: {
      type: Function
    },
    needLogin: {
      type: Boolean
    }
  },
  emits: ['update:visible'],
  setup(props, ctx) {
    const { connectWallet } = useWallet()
    const onLogin = useOnLoggedIn()
    const onWalletLogin = (user?: UserResponse) => {
      if (user) {
        onLogin(user)
      }
      props.onConnected?.()
      ctx.emit('update:visible', false)
    }

    const onWalletClick: UWalletConnectPropsType['onClick'] = async type => {
      const _user = await connectWallet(type, props.needLogin)
      onWalletLogin(_user)
    }

    return () => (
      <UWalletConnect
        show={props.visible}
        onUpdateShow={v => ctx.emit('update:visible', v)}
        onClick={onWalletClick}
      />
    )
  }
})

export default WalletConnectBlock
