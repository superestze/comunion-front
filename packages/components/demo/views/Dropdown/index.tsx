import { UButton, UDropdown, UDropdownFilter } from '@/comps/index'
import { defineComponent, ref } from 'vue'

const DropdownDemoPage = defineComponent({
  name: 'DropdownDemoPage',
  setup() {
    const selected = ref(null)
    return () => (
      <>
        <h4>Dropdown</h4>
        <UDropdown
          trigger="hover"
          options={[
            { label: '1', key: 1 },
            { label: '2', key: 2 }
          ]}
          onSelect={v => (selected.value = v)}
        >
          <UButton>trigger me</UButton>
        </UDropdown>
        {selected.value}
        <h4 class="mt-6">Dropdown filter</h4>
        <UDropdownFilter />
      </>
    )
  }
})

export default DropdownDemoPage
