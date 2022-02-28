import UDropdown from '@/comps/UDropdown'
import UDropdownFilter from '@/comps/UDropdown/DropdownFilter'
import { defineComponent } from 'vue'

const DropdownDemoPage = defineComponent({
  name: 'DropdownDemoPage',
  setup() {
    return () => (
      <>
        <h4>Dropdown</h4>
        <UDropdown />
        <h4 class="mt-6">Dropdown filter</h4>
        <UDropdownFilter />
      </>
    )
  }
})

export default DropdownDemoPage
