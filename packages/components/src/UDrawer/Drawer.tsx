import { CloseOutlined } from '@comunion/icons'
import { NDrawer } from 'naive-ui'
import { defineComponent, ExtractPropTypes } from 'vue'
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
  }
} as const

export type UDrawerPropsType = ExtractPropTypes<typeof UDrawerProps>

const UDrawer = defineComponent({
  name: 'UDrawer',
  props: UDrawerProps,
  emits: ['update:show'],
  setup(props, ctx) {
    const close = () => {
      ctx.emit('update:show', false)
    }
    return () => (
      <NDrawer class="u-drawer" v-model:show={props.show} width={props.width} placement="right">
        <div class="u-drawer-header">
          <span class="u-drawer-header__title">{props.title}</span>
          <CloseOutlined class="u-drawer-header__close" onClick={close} />
        </div>
        <div class="u-drawer-container">
          <UCard class="u-drawer-content">{ctx.slots.default?.()}</UCard>
        </div>
      </NDrawer>
    )
  }
})

export default UDrawer
