import { defineComponent } from 'vue'

// import './index.css'

const <%= name %> = defineComponent({
  name: '<%= name %>',
  props: {},
  setup(props, ctx) {
    return () => <span>{ctx.slots.default?.()}</span>
  },
})

export default <%= name %>
