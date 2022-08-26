import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UCard,
  UForm,
  UFormItemsFactory
} from '@comunion/components'
import { DeleteFilled, PenOutlined, PlusOutlined } from '@comunion/icons'
import { uniqueId } from 'lodash'
import { defineComponent, ref, reactive, PropType, watch } from 'vue'
import { btnGroup } from '../btnGroup'
import Edit from '../edit'

import listHover from '../education/hover.module.css'
import { LanguageList } from '@/constants'
import { services } from '@/services'

type Language = {
  id: string
  language: string
  level: string
}

export default defineComponent({
  props: {
    list: {
      type: Array as PropType<Language[]>,
      default: () => []
    },
    view: {
      type: Boolean,
      default: () => false
    }
  },
  emits: ['Done'],
  setup(props) {
    const editMode = ref<boolean>(false)
    const info = reactive({
      id: uniqueId('lang'),
      language: '',
      level: ''
    })
    const form = ref<FormInst>()

    const languages = ref<Language[]>(props.list)

    console.log(languages)

    watch(
      () => props.list,
      value => {
        languages.value = (value || []) as Language[]
      },
      { immediate: true, deep: true }
    )

    const fields: FormFactoryField[] = [
      {
        t: 'select',
        title: 'Language',
        name: 'language',
        required: true,
        options: LanguageList
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
      fields,
      languages
    }
  },
  render() {
    const handleEditMode =
      (create = false) =>
      () => {
        if (create) {
          this.info.id = uniqueId('lang')
          this.info.language = ''
          this.info.level = ''
        }
        this.editMode = !this.editMode
      }
    const rules = getFieldsRules(this.fields)

    const handleSubmit = () => {
      this.form?.validate(async err => {
        if (typeof err === 'undefined') {
          const index = this.languages.findIndex(item => {
            return item.id === this.info.id
          })
          if (index > -1) {
            this.languages.splice(index, 1, this.info)
          } else {
            this.languages.push(this.info)
          }
          await services['account@languages']({
            languages: this.languages
          })
          this.$emit('Done')
          handleEditMode()()
        }
      })
    }

    const handleCurrentRecord = async (type: 'edit' | 'del', id: string) => {
      if (type === 'edit') {
        const result = this.languages.find(item => item.id === id)
        if (result) {
          this.info = result
          handleEditMode()()
        }
        return
      }
      const index = this.languages.findIndex(item => item.id === id)
      if (index > -1) {
        this.languages.splice(index, 1)
        await services['account@languages']({
          languages: this.languages
        })
        this.$emit('Done')
      }
    }
    return (
      <>
        {this.view && this.languages.length === 0 ? null : (
          <UCard
            title="LANGUAGES"
            class="mb-6"
            v-slots={{
              'header-extra': () => {
                if (this.editMode) {
                  return
                } else if (this.view) {
                  return
                }
                return (
                  <Edit onHandleClick={handleEditMode(true)}>
                    <PlusOutlined class="h-4 mr-3 w-4" />
                    ADD NEW
                  </Edit>
                )
              }
            }}
          >
            {this.editMode ? (
              <div class="flex flex-col mt-6">
                <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
                  <UFormItemsFactory fields={this.fields} values={this.info} />
                </UForm>
                {btnGroup(handleEditMode(), handleSubmit)}
              </div>
            ) : (
              <div class="flex flex-col mt-6">
                {this.languages.length === 0 ? (
                  <p class="text-14px font-[400] text-grey4">Add your Languages</p>
                ) : (
                  <>
                    {this.languages.map(item => (
                      <div
                        class={`flex w-full justify-between items-center h-11 rounded-6px ${listHover['list-hover']}`}
                      >
                        <div class="flex items-center ml-4">
                          <p
                            title={LanguageList.find(l => l.value === item.language)?.label}
                            class="text-grey1 text-14px font-600 max-w-40 overflow-hidden whitespace-nowrap overflow-ellipsis"
                          >
                            {LanguageList.find(l => l.value === item.language)?.label}
                          </p>
                          <p class="bg-grey5 w-1px h-3 mx-2"></p>
                          <p class="text-grey3 text-12px font-400">{item.level}</p>
                        </div>
                        <div class={`hidden mr-4 ${listHover['hidden']} cursor-pointer`}>
                          <PenOutlined
                            class="text-primary w-4 h-4 mr-4.5"
                            onClick={() => handleCurrentRecord('edit', item.id)}
                          />
                          <DeleteFilled
                            class="text-primary w-4 h-4"
                            onClick={() => handleCurrentRecord('del', item.id)}
                          />
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </UCard>
        )}
      </>
    )
  }
})
