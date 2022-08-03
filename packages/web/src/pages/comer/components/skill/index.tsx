import { FormFactoryField, UCard, UFormFactory } from '@comunion/components'
import { PlusOutlined } from '@comunion/icons'
import { defineComponent, ref, reactive } from 'vue'
import Edit from '../edit'

export default defineComponent({
  setup() {
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
    const info = reactive({
      skills: []
    })

    // watchEffect(() => {
    //   info.skills = props.avatar
    // })
    return {
      editMode,
      info,
      fields
    }
  },
  render() {
    const handleEditMode = () => {
      this.editMode = !this.editMode
    }
    const onSubmit = () => {
      console.log('//')
    }
    return (
      <UCard
        title="SKILLS"
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
        <div class="mt-6">
          {this.editMode ? (
            <UFormFactory
              initialValues={this.info}
              fields={this.fields}
              showCancel={true}
              submitText="Update"
              cancelText="Cancel"
              onSubmit={onSubmit}
              onCancel={handleEditMode}
            />
          ) : (
            <div class="flex mt-6">
              <div
                style={{ backgroundColor: 'rgba(83, 49, 244, 0.1)' }}
                class="text-primary py-1.5 px-4 opacity-0.9 rounded-8px"
              >
                12312313
              </div>
            </div>
          )}
        </div>
      </UCard>
    )
  }
})
