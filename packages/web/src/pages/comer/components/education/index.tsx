import { UCard } from '@comunion/components'
import { PlusOutlined, DeleteFilled, PenOutlined } from '@comunion/icons'
import { defineComponent } from 'vue'
import Edit from '../edit'

import listHover from './hover.module.css'

export default defineComponent({
  render() {
    const handleEditMode = () => {
      // todo
    }
    console.log(listHover)
    return (
      <UCard
        title="EDUCATION"
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
            class={`flex w-full justify-between items-center h-17 rounded-6px ${listHover['list-hover']}`}
          >
            <div class="flex flex-col ml-4">
              <p class="text-grey1 text-14px font-600">English</p>

              <div class="flex mt-2">
                <p class="text-grey3 text-12px font-400">computer science engineering Graduated</p>
                <p class="bg-grey5 w-1px h-3 mx-1"></p>
                <p class="text-grey3 text-12px font-400">2014</p>
              </div>
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
