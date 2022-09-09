import { defineComponent, PropType, computed } from 'vue'
import PayedMask from './PayedMask'

interface StageTerm {
  seqNum?: number
  status?: number
  token1Symbol?: string
  token2Symbol?: string
  token1Amount?: number
  token2Amount?: number
  terms?: string
}

export default defineComponent({
  name: 'StageTerm',
  props: {
    item: {
      type: Object as PropType<StageTerm>,
      default: () => {
        return {}
      }
    }
  },
  setup(props) {
    const flagStr = computed(() => {
      if (props.item?.seqNum) {
        if (props.item.seqNum > 3) {
          return `${props.item.seqNum}TH`
        } else if (props.item.seqNum === 3) {
          return '3RD'
        } else if (props.item.seqNum === 2) {
          return '2ND'
        } else if (props.item.seqNum === 1) {
          return '1ST'
        }
      }
      return 'err'
    })

    return {
      flagStr
    }
  },
  render() {
    return (
      //
      <div class="border border-solid rounded-md bg-[#F5F6FA] border-[#D5CFF4] mb-6 py-6 px-16 relative overflow-hidden">
        {this.item?.status === 2 && <PayedMask />}
        <span class="rounded-br-md bg-[#D5CFF4] py-1 px-2 top-0 left-0 text-[#3F2D99] absolute u-card-title2">
          {this.flagStr}
        </span>
        <p class="text-[#5331F4]">
          <span class="text-[#5331F4] u-h3">{this.item.token1Amount}</span>
          <span class="mx-2 text-14px">{this.item.token1Symbol}</span>
          <span class="mx-2 text-20px">+</span>
          <span class="text-[#5331F4] u-h3">{this.item.token2Amount}</span>
          <span class="mx-2 text-14px">{this.item.token2Symbol}</span>
        </p>

        <div class="mt-4 u-body2">{this.item.terms}</div>
      </div>
    )
  }
})
