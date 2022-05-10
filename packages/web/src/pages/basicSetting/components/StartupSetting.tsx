import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'
import EditStartupForm from '@/blocks/Startup/Edit'
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
    const router = useRouter()

    const onCancel = () => {
      router.push({ path: '/dashboard' })
    }

    return () => (
      <div>
        <EditStartupForm startup={props.startup!} onCancel={onCancel} />
      </div>
    )
  }
})

export default StartupSetting
