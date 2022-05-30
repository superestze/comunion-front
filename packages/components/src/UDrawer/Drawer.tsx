import { CloseOutlined } from '@comunion/icons'
import { NDrawer } from 'naive-ui'
import { computed, defineComponent, ExtractPropTypes } from 'vue'
import { UCard } from '../UCard'
import './Drawer.css'

export const UDrawerProps = {
  title: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    default: 928
  },
  show: {
    type: Boolean,
    default: false
  },
  maskClosable: {
    type: Boolean,
    default: true
  }
} as const

export type UDrawerPropsType = ExtractPropTypes<typeof UDrawerProps>

const UDrawer = defineComponent({
  name: 'UDrawer',
  props: UDrawerProps,
  emits: ['update:show'],
  setup(props, ctx) {
    const close = () => {
      visible.value = false
    }
    const visible = computed({
      get() {
        return props.show
      },
      set(v) {
        ctx.emit('update:show', v)
      }
    })
    return () => (
      <NDrawer
        class="u-drawer"
        maskClosable={props.maskClosable}
        v-model:show={visible.value}
        width={props.width}
        placement="right"
      >
        <div class="u-drawer-header">
          <span class="u-drawer-header__title">{props.title}</span>
          <CloseOutlined class="u-drawer-header__close" onClick={close} />
        </div>
        {ctx.slots.default && (
          <div class="u-drawer-container">
            <UCard class="u-drawer-content">{ctx.slots.default?.()}</UCard>
          </div>
        )}
        {ctx.slots.whiteBoard && <div>{ctx.slots.whiteBoard?.()}</div>}
      </NDrawer>
    )
  }
})

export default UDrawer
