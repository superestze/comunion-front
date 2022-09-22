import { UButton, UCard, UModal } from '@comunion/components'
import { WarningFilled } from '@comunion/icons'
import { defineComponent, ref } from 'vue'

const NoStartupTip = defineComponent({
  name: 'NoStartupTip',
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
        <UCard
          style={{ width: '540px' }}
          closable={true}
          onClose={close}
          v-slots={{
            header: () => {
              return (
                <div class="flex relative items-center">
                  <WarningFilled class="mr-4" />{' '}
                  <span class="text-color1 u-h3">You do need create a startup at first</span>
                </div>
              )
            }
          }}
        >
          <div class="min-h-20 p-4 text-color2 u-h6">
            Please do create a startup before creating a bounty.
          </div>
          <div class="flex mt-4 justify-end">
            <UButton type="primary" ghost class="mr-4 w-41" onClick={close}>
              Cancel
            </UButton>
            <UButton type="primary" class="w-41" onClick={toCreateStartup}>
              Go to create
            </UButton>
          </div>
        </UCard>
      </UModal>
    )
  }
})

export default NoStartupTip
