import { UButton } from '@comunion/components'
import { defineComponent, reactive } from 'vue'
import { UnapprovePromptSet, VisibleMap } from '../Dialog'

export default defineComponent({
  setup() {
    const unapproveVisibleMap = reactive<VisibleMap>({
      visibleUnapproveConfirm: false,
      visibleUnapproveFail: false
    })
    return {
      unapproveVisibleMap
    }
  },
  render() {
    const openUnapproveConfirm = () => {
      this.unapproveVisibleMap.visibleUnapproveConfirm = true
    }
    return (
      <>
        <UnapprovePromptSet visibleMap={this.unapproveVisibleMap} />
        <UButton type="primary" ghost size="small" class="w-30" onClick={openUnapproveConfirm}>
          Unapprove
        </UButton>
      </>
    )
  }
})
