import './style.css'

import { NInputGroup } from 'naive-ui'
import { AllowedComponentProps, defineComponent, PropType, watch, ref } from 'vue'
import UInputBigNumber, { UInputBigNumberPropsType } from '../UInputBigNumber/InputBigNumber'

type GroupType = 'withSelect' | 'withUnit'

const UInputNumberGroup = defineComponent({
  name: 'UInputNumberGroup',
  props: {
    inputProps: {
      type: Object as PropType<UInputBigNumberPropsType & AllowedComponentProps>
    },
    value: {
      type: [String, Array],
      default: null
      // required: true
    },
    class: {
      type: String
    },
    type: {
      type: String as PropType<GroupType>
    },
    renderUnit: {
      type: Function as PropType<() => JSX.Element>
    },
    renderSelect: {
      type: Function as PropType<() => JSX.Element>
    }
  },
  emits: ['update:value'],
  setup(props, ctx) {
    const inputValue = ref(props.value)
    watch(
      () => inputValue.value,
      n => {
        ctx.emit('update:value', n)
      }
    )
    const rightPart = () => {
      if (props.type === 'withUnit') {
        return props.renderUnit?.()
      } else if (props.type === 'withSelect') {
        return props.renderSelect?.()
      } else {
        return null
      }
    }
    return () => (
      <div class={['u-input-number-group', props.class]}>
        <NInputGroup>
          <UInputBigNumber v-model:value={props.value} {...props.inputProps} v-slots={ctx.slots} />
          {rightPart()}
        </NInputGroup>
      </div>
    )
  }
})

export { UInputNumberGroup }
