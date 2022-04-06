import { defineComponent, ref } from 'vue'
import CreateStartupForm from '../../../blocks/Startup/CreateForm'

const StartupSetting = defineComponent({
  name: 'StartupSetting',
  setup(prop, ctx) {
    const show = ref(false)

    return () => (
      <div>
        <CreateStartupForm onCancel={() => (show.value = false)} />
      </div>
    )
  }
})

export default StartupSetting
