import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UCard,
  UForm,
  UFormItemsFactory,
  ULazyImage,
  UModal
} from '@comunion/components'
import { defineComponent, reactive, ref, computed, PropType } from 'vue'
import { SocialTypeList } from '@/constants'
import { StartupItem } from '@/types'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    comer: {
      type: Object as PropType<StartupItem>,
      required: true
    }
  },
  setup() {
    const info = reactive({})

    const form = ref<FormInst>()

    const fields = computed<FormFactoryField[]>(() => [
      {
        t: 'select',
        title: 'Roles',
        name: 'type',
        required: true,
        placeholder: 'Select a social tool',
        options: SocialTypeList
      },
      {
        t: 'select',
        title: 'Group',
        name: 'type',
        placeholder: 'Select a social tool',
        options: SocialTypeList
      }
    ])

    return {
      info,
      form,
      fields
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
    }
    const rules = getFieldsRules(this.fields)
    return (
      <UModal show={this.visible}>
        <UCard
          style="width: 600px"
          title="Team Setting"
          bordered={false}
          size="huge"
          role="dialog"
          aria-modal="true"
          closable
          onClose={userBehavier('cancel')}
        >
          <>
            <div class="flex h-21 items-center bg-[#f6f6f6] rounded-8px mb-6 mt-7.5">
              <div class="w-15 h-15 mx-4">
                <ULazyImage class="w-full" src={this.comer.logo} />
              </div>
              <p class="u-title1">{this.comer.name}</p>
            </div>
            <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
              <UFormItemsFactory fields={this.fields} values={this.info} />
            </UForm>
            <div class="flex justify-end mt-40px">
              <UButton
                class="w-40 mr-4"
                type="default"
                onClick={userBehavier('cancel')}
                size="small"
              >
                Cancel
              </UButton>
              <UButton class="w-40" type="primary" onClick={userBehavier('submit')} size="small">
                Submit
              </UButton>
            </div>
          </>
        </UCard>
      </UModal>
    )
  }
})
