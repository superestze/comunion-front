import { UButton } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import { PostUpdateDialog } from '../Dialog'

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      require: true,
      default: () => false
    }
  },
  setup() {
    const visible = ref<boolean>(false)
    return {
      visible
    }
  },
  render() {
    const triggerDialog = () => {
      this.visible = !this.visible
    }
    return (
      <>
        <PostUpdateDialog visible={this.visible} onTriggerDialog={triggerDialog} />
        <UButton
          type="primary"
          size="small"
          class="w-120px"
          onClick={triggerDialog}
          disabled={this.disabled}
        >
          Post update
        </UButton>
      </>
    )
  }
})
