import { UCard } from '@comunion/components'
import { PlusOutlined } from '@comunion/icons'
import { defineComponent } from 'vue'
import Edit from '../edit'

export default defineComponent({
  render() {
    const handleEditMode = () => {
      // todo
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
        <div class="flex mt-6">
          <div
            style={{ backgroundColor: 'rgba(83, 49, 244, 0.1)' }}
            class="text-primary py-1.5 px-4 opacity-0.9 rounded-8px"
          >
            12312313
          </div>
        </div>
      </UCard>
    )
  }
})
