import { defineComponent } from 'vue'
import { ArrowRightOutlined } from '@comunion/icons'
import { StyleProvider } from '..'
import './index.css'

export default defineComponent({
  name: 'UViewMore',
  setup(props, { slots }) {
    return () => (
      <StyleProvider>
        <div class="u-view-more flex">
          <div>{slots.default?.() ?? 'View more'}</div>
          <ArrowRightOutlined class="u-view-more-icon" />
        </div>
      </StyleProvider>
    )
  }
})
