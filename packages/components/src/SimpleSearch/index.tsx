import { defineComponent, ref } from 'vue'
import { addClassPrefix } from '../utils'
import { SearchOutlined } from '@comunion/icons'

// import './index.css'

export default defineComponent({
  name: 'SimpleSearch',
  props: {},
  setup() {
    const value = ref('')
    return () => (
      <div class={addClassPrefix('simple-search')}>
        <SearchOutlined class="simple-search-icon" />
        <input v-model={value.value} placeholder="Please input..." />
      </div>
    )
  },
})
