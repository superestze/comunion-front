import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UCard,
  UForm,
  UFormItemsFactory
} from '@comunion/components'
import { DeleteFilled, PenOutlined, PlusOutlined } from '@comunion/icons'
import { defineComponent, ref, reactive, PropType, Ref } from 'vue'
import Edit from '../edit'

import listHover from '../education/hover.module.css'

type Language = {
  language: string
  level: string
}

export default defineComponent({
  props: {
    obj: {
      type: Object as PropType<Language>
    }
  },
  setup() {
    const editMode = ref<boolean>(false)
    const info = reactive({
      language: '',
      level: ''
    })
    const form = ref<FormInst>()

    const fields: Ref<FormFactoryField[]> = [
      {
        t: 'select',
        title: 'Language',
        name: 'language',
        required: true,
        options: [
          {
            label: 'English',
            value: 'English'
          }
        ]
      },
      {
        t: 'select',
        title: 'Level',
        name: 'level',
        required: true,
        options: [
          { label: 'Beginner', value: 'Beginner' },
          { label: 'Elementary', value: 'Elementary' },
          { label: 'Intermediate', value: 'Intermediate' },
          { label: 'Advanced', value: 'Advanced' }
        ]
      }
    ]
    return {
      editMode,
      info,
      form,
      fields
    }
  },
  render() {
    const handleEditMode = () => {
      this.editMode = !this.editMode
    }
    const rules = getFieldsRules(this.fields)

    const handleSubmit = () => {
      this.form?.validate(err => {
        if (typeof err === 'undefined') {
          console.log('yeah')
        }
      })
    }
    return (
      <UCard
        title="LANGUAGES"
        class="mb-6"
        v-slots={{
          'header-extra': () => (
            <Edit onHandleClick={handleEditMode}>
              <PlusOutlined class="h-4 mr-3 w-4" />
              ADD NEW
            </Edit>
          )
        }}
      >
        {this.editMode ? (
          <div class="flex flex-col mt-6">
            <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
              <UFormItemsFactory fields={this.fields} values={this.info} />
            </UForm>
            <div class="flex justify-end mt-40px">
              <UButton class="mr-16px w-164px" type="default" onClick={handleEditMode}>
                cancel
              </UButton>
              <UButton class="w-164px" type="primary" onClick={handleSubmit}>
                submit
              </UButton>
            </div>
          </div>
        ) : (
          <div class="flex flex-col mt-6">
            <div
              class={`flex w-full justify-between items-center h-11 rounded-6px ${listHover['list-hover']}`}
            >
              <div class="flex items-center ml-4">
                <p class="text-grey1 text-14px font-600">English</p>
                <p class="bg-grey5 w-1px h-3 mx-1"></p>
                <p class="text-grey3 text-12px font-400">Fluent</p>
              </div>
              <div class={`hidden mr-4 ${listHover['hidden']} cursor-pointer`}>
                <PenOutlined class="text-primary w-4 h-4 mr-4.5" />
                <DeleteFilled class="text-primary w-4 h-4" />
              </div>
            </div>
            <div
              class={`flex w-full justify-between items-center h-11 rounded-6px ${listHover['list-hover']}`}
            >
              <div class="flex items-center ml-4">
                <p class="text-grey1 text-14px font-600">English</p>
                <p class="bg-grey5 w-1px h-3 mx-1"></p>
                <p class="text-grey3 text-12px font-400">Fluent</p>
              </div>
              <div class={`hidden mr-4 ${listHover['hidden']} cursor-pointer`}>
                <PenOutlined class="text-primary w-4 h-4 mr-4.5" />
                <DeleteFilled class="text-primary w-4 h-4" />
              </div>
            </div>
          </div>
        )}
      </UCard>
    )
  }
})
