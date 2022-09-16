import { UButton } from '@comunion/components'
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
      <div class="cursor-pointer flex w-full py-2 px-4 items-center hover:bg-color-hover">
        {typeof this.$slots.avatar === 'function' && this.$slots.avatar()}
        <div class="flex flex-1 px-4 items-center overflow-hidden">
          {typeof this.$slots.content === 'function' ? (
            this.$slots.content()
          ) : (
            <div title={this.item[this.keyMap.name]} class="flex-1 text-color1 truncate u-h3 ">
              {this.item[this.keyMap.name]}
            </div>
          )}
        </div>
        {this.connect ? (
          <UButton
            class="flex flex-shrink-0 text-color2 u-h7"
            size="tiny"
            text
            disabled={this.disabled}
            onClick={handleUnconnect}
          >
            {/* <CheckFilled class="mr-2" /> */}
            Unconnect
          </UButton>
        ) : (
          <UButton
            class="flex flex-shrink-0 text-color2 u-h7"
            size="tiny"
            text
            disabled={this.disabled}
            onClick={handleConnect}
          >
            Connect
          </UButton>
        )}
      </div>
    )
  }
})
