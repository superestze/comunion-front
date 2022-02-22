import { NSelect } from 'naive-ui'
import type { SelectBaseOption, SelectOption } from 'naive-ui/lib/select/src/interface'
import { defineComponent, ref } from 'vue'

const UHashInput = defineComponent({
  name: 'UHashInput',
  extends: NSelect,
  setup(props) {
    const loading = ref(false)
    const options = ref<SelectBaseOption[]>([])
    return () => (
      <NSelect
        {...props}
        consistentMenuWidth={false}
        clearable
        loading={loading.value}
        maxTagCount={props.maxTagCount ?? 5}
        multiple
        remote
        options={options.value}
        placeholder="#UI design#  #UX design#"
        renderOption={({ option }: { option: SelectOption }) => `#${option.value}#`}
        tag
      />
    )
  }
})

export default UHashInput
