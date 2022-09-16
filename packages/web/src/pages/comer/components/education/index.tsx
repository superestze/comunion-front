import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UCard,
  UForm,
  UFormItemsFactory
} from '@comunion/components'
import { DeleteFilled, PenOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import { uniqueId } from 'lodash'
import { defineComponent, ref, reactive, PropType, watch } from 'vue'
import { btnGroup } from '../btnGroup'
import Edit from '../edit'

import listHover from './hover.module.css'
import { services } from '@/services'

type EducationType = {
  id: string
  school: string
  major: string
  graduatedAt: number
}

export default defineComponent({
  props: {
    view: {
      type: Boolean,
      default: () => false
    },
    list: {
      type: Array as PropType<EducationType[]>,
      default: () => []
    }
  },
  emits: ['Done'],
  setup(props) {
    const editMode = ref<boolean>(false)
    const info = reactive<EducationType>({
      id: uniqueId('edu'),
      school: '',
      major: '',
      graduatedAt: ref(1183135260000).value
    })
    const form = ref<FormInst>()
    const fields: FormFactoryField[] = [
      {
        t: 'string',
        title: 'College/University Name',
        name: 'school',
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
        name: 'graduatedAt',
        placeholder: 'Select Year of graduation',
        required: true,
        type: 'year',
        class: 'w-full',
        actions: []
      }
    ]

    const educations = ref<EducationType[]>([])

    watch(
      () => props.list,
      value => {
        educations.value = (value || []) as EducationType[]
      },
      { immediate: true, deep: true }
    )
    return {
      editMode,
      info,
      form,
      fields,
      educations
    }
  },
  render() {
    const rules = getFieldsRules(this.fields)

    const handleEditMode =
      (create = false) =>
      () => {
        if (create) {
          this.info.id = uniqueId('edu')
          this.info.major = ''
          this.info.school = ''
          this.info.graduatedAt = ref(1183135260000).value
        }
        this.editMode = !this.editMode
      }

    const handleSubmit = () => {
      this.form?.validate(async err => {
        if (typeof err === 'undefined') {
          const index = this.educations.findIndex(item => {
            return item.id === this.info.id
          })
          if (index > -1) {
            this.educations.splice(index, 1, this.info)
          } else {
            this.educations.push(this.info)
          }
          await services['account@educations']({
            educations: this.educations
          })
          this.$emit('Done')
          handleEditMode()()
        }
      })
    }

    const handleCurrentRecord = async (type: 'edit' | 'del', id: string) => {
      if (type === 'edit') {
        const result = this.educations.find(item => item.id === id)
        if (result) {
          this.info = result
          handleEditMode()()
        }
        return
      }
      const index = this.educations.findIndex(item => item.id === id)
      if (index > -1) {
        this.educations.splice(index, 1)
        await services['account@educations']({
          educations: this.educations
        })
        this.$emit('Done')
      }
    }

    return (
      <>
        {this.view && this.educations.length === 0 ? null : (
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
                return <Edit onHandleClick={handleEditMode(true)}>Add New</Edit>
              }
            }}
          >
            {this.editMode ? (
              <div>
                <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
                  <UFormItemsFactory fields={this.fields} values={this.info} />
                </UForm>
                {btnGroup(handleEditMode(), handleSubmit)}
              </div>
            ) : (
              <div>
                {this.educations.length === 0 ? (
                  <p class="text-color2 u-h5">Add your Education</p>
                ) : (
                  <>
                    {this.educations.map(item => {
                      return (
                        <div
                          class={`-mx-3.5 px-3.5 cursor-pointer flex items-center h-17 rounded-sm ${listHover['list-hover']}`}
                        >
                          <div class="flex-1 overflow-hidden">
                            <p class=" text-color1 u-h5">{item.school}</p>

                            <div class="flex mt-2 text-color3 items-center">
                              <p class="u-tag">{item.major} Graduated</p>
                              <p class="bg-color3 h-3 mx-2 w-1px"></p>
                              <p class="u-tag">{dayjs(item.graduatedAt).format('YYYY')}</p>
                            </div>
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
                      )
                    })}
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
