import { defineComponent } from 'vue'

import { RouterView } from 'vue-router'

export default defineComponent({
  setup() {
    return () => {
      return (
        <div class="h-full p-[16px]">
          <RouterView></RouterView>
        </div>
      )
    }
  }
})
