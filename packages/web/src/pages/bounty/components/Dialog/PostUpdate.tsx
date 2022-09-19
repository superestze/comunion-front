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
import dayjs from 'dayjs'
import { defineComponent, reactive, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { services } from '@/services'
import { useBountyStore } from '@/stores'
import { useBountyContractStore } from '@/stores/bountyContract'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      require: true
    },
    postUpdate: {
      type: Function,
      require: true,
      default: () => false
    }
  },
  emits: ['triggerDialog'],
  setup(props) {
    const route = useRoute()
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

    const gap = computed(() => {
      return dayjs(new Date(bountyContractStore.bountyContractInfo.timeLock * 1000)).diff(
        dayjs(new Date()),
        'day'
      )
    })
    return {
      postUpdateFields,
      fields,
      info,
      form,
      getActivities,
      bountyContractInfo: bountyContractStore.bountyContractInfo,
      gap,
      route
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
          /**
           * POSTUPDATE does not require contract operation
           * */
          // if (this.gap >= 0) {
          //   await this.postUpdate(
          //     'Waiting to submit all contents to blockchain for post update',
          //     'Post update succeedes'
          //   )
          // }
          const { error } = await services['bounty@bounty-activities']({
            sourceType: 1,
            content: this.info.update,
            bountyID: this.route.params.id as string
          })
          if (!error) {
            this.getActivities(this.route.params.id as string)
            triggerDialog()
          }
        }
      })
    }
    return (
      <UModal show={this.visible}>
        <UCard
          style={{
            width: '600px',
            '--n-title-text-color': '#000000',
            '--n-close-icon-color': '#5331F4'
          }}
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
              class="mt-8px mb-25px"
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
                Cancel
              </UButton>
              <UButton class="w-164px" type="primary" onClick={userBehavier('submit')} size="small">
                Submit
              </UButton>
            </div>
          </>
        </UCard>
      </UModal>
    )
  }
})
