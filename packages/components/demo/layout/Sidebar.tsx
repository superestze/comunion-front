import { defineComponent } from 'vue'
import { NMenu } from 'naive-ui'
import type { MenuMixedOption } from 'naive-ui/lib/menu/src/interface'
import { useRoute, useRouter } from 'vue-router'

const menuItems: MenuMixedOption[] = [
  {
    title: 'PaginatedList',
    key: '/paginated-list'
  }
]

export default defineComponent({
  setup() {
    return () => {
      const router = useRouter()
      const { path } = useRoute()

      return (
        <div class="w-[200px] p-y-[16px] border-r-1">
          <NMenu
            value={path}
            options={menuItems}
            onSelect={key => {
              router.push({ path: key })
            }}
          />
        </div>
      )
    }
  }
})
