import { UBreadcrumb, UBreadcrumbItem } from '@comunion/components'
import { ArrowLeftOutlined } from '@comunion/icons'
import { computed, defineComponent } from 'vue'
import { RouteRecordName, useRoute, useRouter } from 'vue-router'

const Breadcrumb = defineComponent({
  name: 'Breadcrumb',
  setup(props, ctx) {
    const route = useRoute()
    const router = useRouter()

    const breadcrumbData = computed(() => {
      // TODO: the routes should add parent route info in meta, includes name, path, parent route and so on, so the data get by route directly
      const result: { path: string; name: RouteRecordName | undefined }[] = [
        {
          path: '/dashboard',
          name: 'my dashboard'
        }
      ]
      const r = route.matched.find(r => r.name && r.path)
      if (r) {
        result.push({
          name: r.name,
          path: r.path
        })
      }
      return result
    })

    const onLinkClick = (path: string) => {
      router.push(path)
    }

    const slots = {
      separator: () => <ArrowLeftOutlined />
    }

    return () => (
      <>
        <div class="mb-10">
          <UBreadcrumb class="flex items-center">
            <UBreadcrumbItem v-slots={slots}></UBreadcrumbItem>
            {breadcrumbData.value.map((item, index) => (
              <UBreadcrumbItem key={item.path} v-slots={slots}>
                {index == breadcrumbData.value.length - 1 ? (
                  <span class="u-label1 uppercase text-primary">{item.name}</span>
                ) : (
                  <span
                    class="u-label1 uppercase text-primary"
                    onClick={() => onLinkClick(item.path)}
                  >
                    {item.name}
                  </span>
                )}
              </UBreadcrumbItem>
            ))}
          </UBreadcrumb>
        </div>
      </>
    )
  }
})

export default Breadcrumb
