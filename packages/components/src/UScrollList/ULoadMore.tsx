import { defineComponent, toRefs } from 'vue'

import { NSpin } from 'naive-ui'

import './index.css'

const scrollListProps = {
  loading: {
    type: Boolean,
    default: false
  },
  noMore: {
    type: Boolean,
    default: false
  },
  height: {
    type: Number,
    default: 60
  },
  loadingText: {
    type: String,
    default: '加载中...'
  },
  noMoreText: {
    type: String,
    default: '没有更多数据了'
  }
} as const

export type UScrollListProps = typeof scrollListProps

const ULoadMore = defineComponent({
  props: scrollListProps,
  setup(props) {
    const { loadingText, noMoreText, noMore, loading, height } = toRefs(props)

    return () => {
      if (noMore?.value === true) {
        return (
          <div
            style={{
              height: `${height?.value}px`
            }}
            class="flex flex-row items-center justify-center bg-[#f2f2f2]"
          >
            <div class="flex flex-row items-center justify-center">
              <span class="ml-8px text-[#999] text-[14px]">{noMoreText?.value}</span>
            </div>
          </div>
        )
      }

      return (
        <div
          style={{
            height: loading?.value === true ? `${height?.value}px` : 0,
            overflow: 'hidden'
          }}
          class="flex flex-row items-center justify-center bg-[#f2f2f2]"
        >
          <div class="flex flex-row items-center justify-center">
            <NSpin size="small" />
            <span class="ml-8px text-[#999] text-[14px]">{loadingText?.value}</span>
          </div>
        </div>
      )
    }
  }
})

export default ULoadMore
