import { UScrollbar, UTooltip } from '@comunion/components'
import { CopyOutlined } from '@comunion/icons'
import copy from 'copy-to-clipboard'
import { defineComponent, computed, ref } from 'vue'

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true
    },
    content: {
      type: String,
      requred: true
    },
    foldAble: {
      type: Boolean,
      required: false,
      default: () => false
    },
    fold: {
      type: Boolean,
      required: false,
      default: () => false
    },
    contentClass: {
      type: String,
      required: false,
      default: () => 'text-primary2'
    },
    maxHeight: {
      type: Number,
      default: () => 120
    },
    pasteboard: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props, ctx) {
    const contentClass = computed(() => {
      return `flex-grow-1 text-16px flex items-center ${props.contentClass}`
    })

    const foldClass = computed(() => {
      const str = 'whitespace-pre-wrap break-all overflow-hidden'
      if (props.fold) {
        return `${str} overflow-ellipsis line-clamp-3 ${contentClass.value} min-h-20px`
      }
      return `${str} ${contentClass.value}`
    })

    const showTooltipRef = ref<boolean>(false)
    const ele = ref<any>()
    ctx.expose({
      ele
    })
    return {
      contentClass,
      foldClass,
      showTooltipRef,
      ele
    }
  },
  render() {
    return (
      <div class="flex">
        <div class="w-169px flex-shrink-0 text-grey3 text-14px flex items-start">{this.label}</div>
        {this.foldAble ? (
          <UScrollbar style={{ maxHeight: `${this.maxHeight}px` }}>
            <p class={this.foldClass} ref={(ref: any) => (this.ele = ref)} v-html={this.content} />
          </UScrollbar>
        ) : (
          <p class={`${this.contentClass} h-20px`}>
            {this.content}
            {this.pasteboard ? (
              <span
                class="u-address__copy"
                onClick={e => {
                  e.stopPropagation()
                  this.showTooltipRef = copy(this.content || '')
                }}
                onMouseleave={e => {
                  e.stopPropagation()
                  this.showTooltipRef = false
                }}
              >
                <UTooltip show={this.showTooltipRef}>
                  {{
                    trigger: () => <CopyOutlined class="u-address__icon" />,
                    default: () => 'Copied!'
                  }}
                </UTooltip>
              </span>
            ) : null}
          </p>
        )}
      </div>
    )
  }
})