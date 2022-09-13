import { UButton, UCard, UModal } from '@comunion/components'
import { WarningFilled } from '@comunion/icons'
import { defineComponent, ref } from 'vue'

const NoFollowedStartupTip = defineComponent({
  name: 'NoFollowedStartupTip',
  emits: ['toCreate'],
  setup(props, ctx) {
    const modalVisibleState = ref(false)
    const show = () => {
      modalVisibleState.value = true
    }
    const close = () => {
      modalVisibleState.value = false
    }
    const toCreateStartup = () => {
      modalVisibleState.value = false
      ctx.emit('toCreate')
    }
    ctx.expose({
      show,
      close
    })
    return () => (
      <UModal v-model:show={modalVisibleState.value} maskClosable={false} autoFocus={false}>
        <UCard style={{ width: '540px' }} closable={true} class="!p-7" onClose={close}>
          <div class="relative -top-3 flex items-center">
            <WarningFilled />{' '}
            <span class="u-title3 ml-4">You have not joined or connected any startup</span>
          </div>
          <div class="mt-3 ml-12 u-body2 text-grey3">
            Please join or connect a startup before create proposal.
          </div>
          <div class="flex justify-end mt-20">
            <UButton type="primary" ghost class="w-41 mr-4 h-9" onClick={close}>
              Cancel
            </UButton>
            <UButton type="primary" class="w-41 h-9" onClick={toCreateStartup}>
              Ok
            </UButton>
          </div>
        </UCard>
      </UModal>
    )
  }
})

export default NoFollowedStartupTip
