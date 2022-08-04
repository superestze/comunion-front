import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UCard,
  UForm,
  UFormItemsFactory
} from '@comunion/components'
import { PlusOutlined } from '@comunion/icons'
import { defineComponent, ref, reactive, PropType, watchEffect } from 'vue'
import { btnGroup } from '../btnGroup'
import Edit from '../edit'

export default defineComponent({
  props: {
    skills: {
      type: Array as PropType<string[]>,
      required: true
    }
  },
  setup(props) {
    const editMode = ref<boolean>(false)

    const fields: FormFactoryField[] = [
      {
        t: 'skillTags',
        title: 'Skills',
        name: 'skills',
        tagLimit: 999,
        required: true
      }
    ] as unknown as FormFactoryField[]
    const info = reactive<{ skills: string[] }>({
      skills: []
    })

    watchEffect(() => {
      info.skills = props.skills || []
    })
    const form = ref<FormInst>()

    return {
      editMode,
      info,
      fields,
      form
    }
  },
  render() {
    const handleEditMode = () => {
      this.editMode = !this.editMode
    }
    const handleSubmit = () => {
      this.form?.validate(err => {
        if (typeof err === 'undefined') {
          console.log(this.info.skills)
        }
      })
    }
    const rules = getFieldsRules(this.fields)
    return (
      <UCard
        title="SKILLS"
        class="mb-6"
        v-slots={{
          'header-extra': () => {
            if (this.editMode) {
              return <span></span>
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
          <div class="flex flex-col mt-6">
            <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
              <UFormItemsFactory fields={this.fields} values={this.info} />
            </UForm>
            {btnGroup(handleEditMode, handleSubmit)}
          </div>
        ) : (
          <div class="flex flex-wrap mt-6">
            {Array.isArray(this.info.skills) &&
              this.info.skills.map(value => (
                <div
                  style={{ backgroundColor: 'rgba(83, 49, 244, 0.1)' }}
                  class="text-primary py-1.5 px-4 opacity-0.9 rounded-8px mr-2 mb-2"
                >
                  {value}
                </div>
              ))}
          </div>
        )}
      </UCard>
    )
  }
})
