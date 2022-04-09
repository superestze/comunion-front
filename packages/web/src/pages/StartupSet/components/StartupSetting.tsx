import { defineComponent, PropType, ref } from 'vue'
import { useRouter } from 'vue-router'
import CreateStartupForm from '../../../blocks/Startup/CreateForm'
import { StartupItem } from '@/types'

const StartupSetting = defineComponent({
  name: 'StartupSetting',
  props: {
    startup: {
      type: Object as PropType<StartupItem>,
      require: true
    }
  },
  setup(props, ctx) {
    const show = ref(false)
    const router = useRouter()

    const onCancel = () => {
      show.value = false
      router.push({ path: '/dashboard' })
    }

    return () => (
      <div>
        <CreateStartupForm startup={props.startup} onCancel={onCancel} />
      </div>
    )
  }
})

export default StartupSetting
