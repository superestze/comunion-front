import { UScrollbar } from '@comunion/components'
import { defineComponent, computed, ref } from 'vue'
import Copy from '@/components/Copy'
import './paragraph.css'

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
      return `flex-grow-1 u-title3 flex items-center ${props.contentClass}`
    })

    const foldClass = computed(() => {
      const str = 'whitespace-pre-wrap break-all overflow-hidden'
      if (props.fold) {
        return `${str} overflow-ellipsis line-clamp-3 ${contentClass.value}`
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
        <div class="w-42 flex-shrink-0 text-grey3 flex items-start bounty-info-label">
          {this.label}
        </div>
        {this.foldAble ? (
          <UScrollbar style={{ maxHeight: `${this.maxHeight}px` }}>
            <p class={this.foldClass} ref={(ref: any) => (this.ele = ref)} v-html={this.content} />
          </UScrollbar>
        ) : (
          <p class={`${this.contentClass} bounty-info-content h-20px`}>
            {this.content}
            {this.pasteboard ? <Copy content={this.content || ''} /> : null}
          </p>
        )}
      </div>
    )
  }
})
