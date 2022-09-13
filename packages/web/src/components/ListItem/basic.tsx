import { UButton } from '@comunion/components'
import { CheckFilled, PlusOutlined } from '@comunion/icons'
import { defineComponent, PropType, ref, watch, computed } from 'vue'

export default defineComponent({
  name: 'BaseMemberItem',
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
    const disabled = computed(() => {
      return typeof props.item[props.keyMap.follow] === 'undefined'
    })

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
      connect,
      disabled
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
      <div class="flex w-full items-center">
        <div class="flex h-full flex-shrink-0 mt-2px items-center justify-center">
          {typeof this.$slots.avatar === 'function' && this.$slots.avatar()}
        </div>
        <div class="flex flex-1 h-17 ml-4 items-center overflow-hidden">
          {typeof this.$slots.content === 'function' ? (
            this.$slots.content()
          ) : (
            <div title={this.item[this.keyMap.name]} class="flex-1 text-grey1 truncate u-title3 ">
              {this.item[this.keyMap.name]}
            </div>
          )}
          {this.connect ? (
            <UButton
              class="flex flex-shrink-0 h-7 w-111px"
              size="tiny"
              secondary
              type="tertiary"
              disabled={this.disabled}
              onClick={handleUnconnect}
            >
              <CheckFilled class="mr-2" />
              Unconnect
            </UButton>
          ) : (
            <UButton
              class="flex flex-shrink-0 h-7 w-111px"
              size="tiny"
              ghost
              type="primary"
              disabled={this.disabled}
              onClick={handleConnect}
            >
              <PlusOutlined class="h-4 mr-2 w-4" />
              Connect
            </UButton>
          )}
        </div>
      </div>
    )
  }
})
