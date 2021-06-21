import { defineComponent } from 'vue'
// import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'HomePage',
  props: {},
  setup() {
    return () => <router-link to="/auth/github">Github Oauth</router-link>
  },
})
