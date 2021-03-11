import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'WelcomePage',
  props: {},
  setup(props, ctx) {
    return () => (
      <div>
        Hello UI components.
        <RouterLink to="/lib">Components</RouterLink>
      </div>
    )
  },
})
