import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UCard,
  UForm,
  UFormItemsFactory
} from '@comunion/components'
import { PlusOutlined, DeleteFilled, PenOutlined } from '@comunion/icons'
import { defineComponent, ref, reactive } from 'vue'
import { btnGroup } from '../btnGroup'
import Edit from '../edit'

import listHover from './hover.module.css'

export default defineComponent({
  props: {
    view: {
      type: Boolean,
      default: () => false
    },
    obj: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const editMode = ref<boolean>(false)
    const info = reactive({
      university: '',
      major: '',
      graduation: ref(1183135260000)
    })
    const form = ref<FormInst>()
    const fields: FormFactoryField[] = [
      {
        t: 'string',
        title: 'College/University Name',
        name: 'university',
        required: true,
        placeholder: 'Your College/University Name'
      },
      {
        t: 'string',
        title: 'Major',
        name: 'major',
        required: true,
        placeholder: 'Major'
      },
      {
        t: 'date',
        title: 'Year of graduation',
        name: 'graduation',
        placeholder: 'Select Year of graduation',
        required: true,
        type: 'year',
        class: 'w-full',
        actions: ['clear']
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
    const rules = getFieldsRules(this.fields)
    const handleEditMode = () => {
      this.editMode = !this.editMode
    }

    const handleSubmit = () => {
      this.form?.validate(err => {
        console.log(err)
        if (typeof err === 'undefined') {
          console.log('yeah')
        }
      })
    }

    const handleCurrentRecord = (type: 'edit' | 'del') => {
      if (type === 'edit') {
        handleEditMode()
        return
        // todo
      }
    }

    return (
      <>
        {this.view && this.obj.length === 0 ? null : (
          <UCard
            title="EDUCATION"
            class="mb-6"
            v-slots={{
              'header-extra': () => {
                if (this.editMode) {
                  return
                } else if (this.view) {
                  return
                }
                return (
                  <Edit onHandleClick={handleEditMode}>
                    <PlusOutlined class="h-4 mr-3 w-4" />
                    ADD NEW
                  </Edit>
                )
              }
            }}
          >
            {this.editMode ? (
              <div class="mt-6">
                <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
                  <UFormItemsFactory fields={this.fields} values={this.info} />
                </UForm>
                {btnGroup(handleEditMode, handleSubmit)}
              </div>
            ) : (
              <div class="flex flex-col mt-6">
                {this.obj.length === 0 ? (
                  <p class="text-14px font-[400] text-grey4 mt-6">Add your Education</p>
                ) : (
                  <div
                    class={`flex w-full justify-between items-center h-17 rounded-6px ${listHover['list-hover']}`}
                  >
                    <div class="flex flex-col ml-4">
                      <p class="text-grey1 text-14px font-600">English</p>

                      <div class="flex mt-2">
                        <p class="text-grey3 text-12px font-400">
                          computer science engineering Graduated
                        </p>
                        <p class="bg-grey5 w-1px h-3 mx-1"></p>
                        <p class="text-grey3 text-12px font-400">2014</p>
                      </div>
                    </div>
                    <div class={`hidden mr-4 ${listHover['hidden']} cursor-pointer`}>
                      <PenOutlined
                        class="text-primary w-4 h-4 mr-4.5"
                        onClick={() => handleCurrentRecord('edit')}
                      />
                      <DeleteFilled
                        class="text-primary w-4 h-4"
                        onClick={() => handleCurrentRecord('del')}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </UCard>
        )}
      </>
    )
  }
})
