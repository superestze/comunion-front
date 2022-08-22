import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UCard,
  UForm,
  UFormItemsFactory,
  UModal
} from '@comunion/components'
import { defineComponent, reactive, ref, watch } from 'vue'
import { useBountyContractWrapper } from '../../hooks/useBountyContractWrapper'
import { services } from '@/services'
import { useBountyStore } from '@/stores'
import { useBountyContractStore } from '@/stores/bountyContract'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      require: true
    }
  },
  emits: ['triggerDialog'],
  setup(props) {
    const info = reactive({
      update: ''
    })

    watch(
      () => props.visible,
      value => {
        if (value) {
          info.update = ''
        }
      }
    )
    const fields: FormFactoryField[] = [
      {
        t: 'string',
        title: 'This update will be shown on activity',
        name: 'update',
        placeholder: '',
        minlength: 100,
        required: true,
        type: 'textarea',
        rules: [
          {
            required: true,
            message: 'Please enter an update'
          }
        ],
        autosize: {
          minRows: 5,
          maxRows: 10
        }
      }
    ]

    const postUpdateFields = getFieldsRules(fields)
    const form = ref<FormInst>()
    const bountyStore = useBountyStore()
    const bountyContractStore = useBountyContractStore()
    const { getActivities } = bountyStore
    const { bountyContract, gap } = useBountyContractWrapper()
    const { postUpdate } = bountyContract
    return {
      postUpdateFields,
      fields,
      info,
      form,
      getActivities,
      postUpdate,
      bountyContractInfo: bountyContractStore.bountyContractInfo,
      gap
    }
  },
  render() {
    const triggerDialog = () => {
      this.$emit('triggerDialog')
    }

    const userBehavier = (type: 'submit' | 'cancel') => async () => {
      if (type === 'cancel') {
        triggerDialog()
        return
      }
      this.form?.validate(async err => {
        if (typeof err === 'undefined') {
          if (this.gap >= 0) {
            await this.postUpdate('', '')
          }
          const { error } = await services['bounty@bounty-activities']({
            sourceType: 1,
            content: this.info.update,
            bountyID: this.$route.query.bountyId as string
          })
          if (!error) {
            this.getActivities(this.$route.query.bountyId as string)
            triggerDialog()
          }
        }
      })
    }
    return (
      <UModal show={this.visible}>
        <UCard
          style="width: 600px"
          title="Post update"
          bordered={false}
          size="huge"
          role="dialog"
          aria-modal="true"
          closable
          onClose={triggerDialog}
        >
          <>
            <UForm
              rules={this.postUpdateFields}
              model={this.info}
              ref={(ref: any) => (this.form = ref)}
              class="mb-25px mt-8px"
            >
              <UFormItemsFactory fields={this.fields} values={this.info} />
            </UForm>
            <div class="flex justify-end">
              <UButton
                class="mr-16px w-164px"
                type="default"
                onClick={userBehavier('cancel')}
                size="small"
              >
                cancel
              </UButton>
              <UButton class="w-164px" type="primary" onClick={userBehavier('submit')} size="small">
                submit
              </UButton>
            </div>
          </>
        </UCard>
      </UModal>
    )
  }
})
