import { NSpin } from 'naive-ui'
import { defineComponent, computed } from 'vue'
import './style.css'

export const USpin = defineComponent({
  name: 'LoadingWrap',
  props: ['show'],
  setup(props, ctx) {
    const show = computed(() => {
      return props.show
    })
    return () => (
      <NSpin show={show.value} class="loading-wrap">
        <div>{ctx.slots.default?.()}</div>
      </NSpin>
    )
  }
})
