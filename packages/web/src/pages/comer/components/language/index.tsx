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
        <div class="flex mt-6"></div>
      </UCard>
    )
  }
})
