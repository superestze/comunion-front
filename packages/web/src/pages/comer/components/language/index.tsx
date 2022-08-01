import { UCard } from '@comunion/components'
import { DeleteFilled, PenOutlined, PlusOutlined } from '@comunion/icons'
import { defineComponent } from 'vue'
import Edit from '../edit'

import listHover from '../education/hover.module.css'

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
      </UCard>
    )
  }
})
