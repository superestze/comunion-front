import { UButton, UCard, UInput, UModal } from '@comunion/components'
import { DeleteFilled, PlusOutlined } from '@comunion/icons'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const groups = ref<{ value: string }[]>([{ value: '' }])
    return {
      groups
    }
  },
  emits: ['triggerDialog'],
  render() {
    const triggerDialog = () => {
      this.$emit('triggerDialog')
    }

    const userBehavier = (type: string) => () => {
      if (type === 'cancel') {
        triggerDialog()
        return
      }
      console.log(this.groups)
    }

    const addGroup = () => {
      this.groups.push({ value: '' })
    }

    const removeGroup = (index: number) => () => {
      this.groups.splice(index, 1)
    }
    return (
      <UModal show={this.visible}>
        <UCard
          style="width: 400px"
          title="Group management"
          bordered={false}
          size="huge"
          role="dialog"
          aria-modal="true"
          closable
          onClose={userBehavier('cancel')}
        >
          <>
            <div class="h-9.5 w-full"></div>
            {this.groups.map((group, index) => (
              <div class="flex items-center mb-4">
                <UInput
                  placeholder="Group Name"
                  v-model:value={group.value}
                  maxlength={200}
                  v-slots={{
                    suffix: () =>
                      this.groups.length > 1 ? (
                        <DeleteFilled
                          class="w-3 h-3 ml-4.5 text-grey3 cursor-pointer"
                          onClick={removeGroup(index)}
                        />
                      ) : null
                  }}
                />
              </div>
            ))}
            <UButton dashed class="w-full u-body2" onClick={addGroup}>
              <span class="u-body2 flex items-center text-grey3">
                <PlusOutlined class="h-4 mr-3 w-4" />
                Add
              </span>
            </UButton>
            <div class="flex justify-end mt-40px">
              <UButton class="w-40" type="primary" onClick={userBehavier('submit')} size="small">
                Save
              </UButton>
            </div>
          </>
        </UCard>
      </UModal>
    )
  }
})
