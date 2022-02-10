import { defineComponent } from 'vue'

const UserWelcomePage = defineComponent({
  name: 'UserWelcomePage',
  setup() {
    return () => <div class="font-orbitron u-h1 !font-normal">Welcome to Comunion!</div>
  }
})

export default UserWelcomePage
