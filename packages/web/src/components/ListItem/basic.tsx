import { UButton } from '@comunion/components'
import { CheckFilled, PlusOutlined } from '@comunion/icons'
import { defineComponent, PropType, ref, watch } from 'vue'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<any>,
      required: true
    },
    keyMap: {
      type: Object as PropType<{ [key: string]: string }>,
      default: () => ({
        name: 'name',
        follow: 'follow'
      })
    }
  },
  setup(props) {
    const connect = ref<boolean>(!props.item[props.keyMap.follow])

    watch(
      () => props.item[props.keyMap.follow],
      value => {
        connect.value = value
      },
      {
        immediate: true
      }
    )
    return {
      connect
    }
  },
  emits: ['connect', 'unconnect'],
  render() {
    const handleConnect = () => {
      this.$emit('connect', {
        ...this.item,
        cb: () => {
          this.connect = true
        }
      })
    }
    const handleUnconnect = () => {
      this.$emit('unconnect', {
        ...this.item,
        cb: () => {
          this.connect = false
        }
      })
    }
    return (
      <div class="flex w-full items-center px-4">
        <div class="flex flex-shrink-0 items-center justify-center h-full mt-2px">
          {typeof this.$slots.avatar === 'function' && this.$slots.avatar()}
        </div>
        <div class="flex flex-grow border-grey5 border-b h-17 items-center ml-4 justify-between">
          {typeof this.$slots.content === 'function' ? (
            this.$slots.content()
          ) : (
            <div class="w-full text-16px font-600 text-grey1 items-center">
              {this.item[this.keyMap.name]}
            </div>
          )}
          {this.connect ? (
            <UButton
              class="w-111px flex-shrink-0 h-7 flex"
              size="tiny"
              secondary
              type="tertiary"
              onClick={handleUnconnect}
            >
              <CheckFilled class="mr-2" />
              Unconnect
            </UButton>
          ) : (
            <UButton
              class="w-111px flex-shrink-0 h-7 flex"
              size="tiny"
              ghost
              type="primary"
              onClick={handleConnect}
            >
              <PlusOutlined class="mr-2 w-4 h-4" />
              Connect
            </UButton>
          )}
        </div>
      </div>
    )
  }
})
