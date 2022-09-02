import {
  USpin,
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
import { defineComponent, reactive, ref, computed, inject, PropType, watch } from 'vue'
import { GroupItem } from '../../../hooks/useGroup'
import { services } from '@/services'

export type editComerData = {
  comerAvatar: string
  comerId: number
  comerName: string
  joinedTime: string
  location?: string
  isNew?: boolean
  groupId?: number
  groupName?: string
  startupId?: number
}

export default defineComponent({
  name: 'addTeamMemberDialog',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    comer: {
      type: Object as PropType<editComerData>
    },
    startupId: {
      type: [Number, String],
      required: true
    }
  },
  setup(props) {
    const loading = ref(false)

    const info = reactive({
      Roles: '',
      Group: 0
    })

    watch(
      () => props.comer,
      propsComer => {
        info.Roles = propsComer?.location || ''
        info.Group = propsComer?.groupId || 0
      },
      {
        immediate: true
      }
    )

    const groups = inject<GroupItem[]>('group', [])
    const groupsOption = computed(() => {
      return groups.value.map((item: { name: string; id: number }) => {
        return {
          label: item.name,
          value: item.id
        }
      })
    })
    const form = ref<FormInst>()

    const fields = computed<FormFactoryField[]>(() => [
      {
        t: 'string',
        title: 'Roles',
        name: 'Roles',
        required: true,
        placeholder: 'Input a role',
        maxlength: 50
      },
      {
        t: 'select',
        title: 'Group',
        name: 'Group',
        placeholder: 'Select a group',
        options: groupsOption.value
      }
    ])

    return {
      loading,
      info,
      form,
      fields,
      startupId: props.startupId
    }
  },
  emits: ['triggerDialog', 'triggerActionDone'],
  render() {
    const triggerDialog = () => {
      this.$emit('triggerDialog')
    }

    const userBehavier = (type: string) => () => {
      if (type === 'cancel') {
        return triggerDialog()
      }

      this.form?.validate(async err => {
        if (!err) {
          this.loading = true
          // startup@change-comer-group-and-location
          if (!this.comer) {
            return console.warn('this.comer is missing!')
          }
          if (this.comer.isNew) {
            // create
            const { error } = await services['startup@start-team-meabers-create']({
              startupId: this.startupId,
              comerId: this.comer.comerId,
              position: this.info.Roles
            })
            if (!error) {
              console.warn('create success!')
            }
          } else {
            // edit
            const { error } = await services['startup@change-comer-group-and-location']({
              startupID: this.startupId,
              groupID: this.info.Group,
              comerID: this.comer.comerId,
              location: this.info.Roles
            })
            if (!error) {
              console.warn('edit success!')
            }
          }

          this.loading = false
          this.$emit('triggerActionDone')
          triggerDialog()
        }
      })
    }
    const rules = getFieldsRules(this.fields)

    return (
      <UModal show={this.visible}>
        <USpin show={this.loading}>
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
              <div class="flex bg-[#f6f6f6] rounded-8px h-21 mt-7.5 mb-6 items-center">
                <div class="h-15 mx-4 w-15">
                  <ULazyImage class="w-full" src={this.comer?.comerAvatar || ''} />
                </div>
                <p class="u-title1">{this.comer?.comerName}</p>
              </div>
              <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
                <UFormItemsFactory fields={this.fields} values={this.info} />
              </UForm>
              <div class="flex mt-40px justify-end">
                <UButton
                  class="mr-4 w-40"
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
        </USpin>
      </UModal>
    )
  }
})
