import { UButton } from '@comunion/components'
import { defineComponent } from 'vue'
import { BasicSortable } from '@/components/sortable'

export default defineComponent({
  render() {
    const handleSubmit = () => {
      // todo
    }
    return (
      <div class="bg-white rounded-lg border mb-6 relative overflow-hidden min-h-205.5">
        <div class="mx-10 my-9.5">
          <h3 class="u-h3 mb-10">
            Show each activities in startup detail according to the following sequence
          </h3>
          <BasicSortable />
          <div class="flex mt-10 items-center justify-end">
            <UButton class="w-30" type="primary" size="small" onClick={handleSubmit}>
              Save
            </UButton>
          </div>
        </div>
      </div>
    )
  }
})
