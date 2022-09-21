import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UCard,
  UForm,
  UFormItemsFactory,
  USpin
} from '@comunion/components'
import { DeleteFilled, PenOutlined } from '@comunion/icons'
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
    const loading = ref(false)
    const editMode = ref<boolean>(false)
    const info = reactive({
      id: uniqueId('lang'),
      language: '',
      level: ''
    })
    const form = ref<FormInst>()

    const languages = ref<Language[]>(props.list)

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
      loading,
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
          this.loading = true
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
          this.loading = false
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
        this.loading = true
        await services['account@languages']({
          languages: this.languages
        })
        this.$emit('Done')
        this.loading = false
      }
    }
    return (
      <USpin show={this.loading}>
        {this.view && this.languages.length === 0 ? null : (
          <UCard
            title="Languages"
            class="mb-6"
            v-slots={{
              'header-extra': () => {
                if (this.editMode) {
                  return
                } else if (this.view) {
                  return
                }
                return <Edit onHandleClick={handleEditMode(true)}>Add New</Edit>
              }
            }}
          >
            {this.editMode ? (
              <div class="flex flex-col ">
                <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
                  <UFormItemsFactory fields={this.fields} values={this.info} />
                </UForm>
                {btnGroup(handleEditMode(), handleSubmit)}
              </div>
            ) : (
              <div class="flex flex-col ">
                {this.languages.length === 0 ? (
                  <p class="text-color3 u-h5">Add your Languages</p>
                ) : (
                  <>
                    {this.languages.map(item => (
                      <div
                        class={`cursor-pointer -mx-3.5 px-3.5 flex items-center h-11 rounded-sm ${listHover['list-hover']}`}
                      >
                        <div class="flex flex-1 items-center overflow-hidden">
                          <p
                            title={LanguageList.find(l => l.value === item.language)?.label}
                            class="h-5 max-w-2/3 text-color1 truncate u-h6"
                          >
                            {LanguageList.find(l => l.value === item.language)?.label}
                          </p>
                          <p class="bg-color3 h-3 mx-2 w-1px"></p>
                          <p class="text-color3 u-tag truncate">{item.level}</p>
                        </div>
                        <div
                          class={`hidden mr-4 ${
                            !this.view ? listHover['hidden'] : ''
                          } cursor-pointer`}
                        >
                          <PenOutlined
                            class="h-4 text-primary mr-4.5 w-4"
                            onClick={() => handleCurrentRecord('edit', item.id)}
                          />
                          <DeleteFilled
                            class="h-4 text-primary w-4"
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
      </USpin>
    )
  }
})
