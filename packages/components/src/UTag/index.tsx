import { defineComponent } from 'vue'
import './index.css'
import { StyleProvider } from '..'

export default defineComponent({
  name: 'UTag',
  setup(props, { slots }) {
    return () => (
      <StyleProvider>
        <div class="u-tag">{slots.default?.()}</div>
      </StyleProvider>
    )
  }
})
