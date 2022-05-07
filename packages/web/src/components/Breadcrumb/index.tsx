import { UBreadcrumb, UBreadcrumbItem } from '@comunion/components'
import { ArrowLeftOutlined } from '@comunion/icons'
import { defineComponent, reactive, watch } from 'vue'
import { RouteRecordName, useRoute, useRouter } from 'vue-router'

const Breadcrumb = defineComponent({
  name: 'Breadcrumb',
  setup(props, ctx) {
    const route = useRoute()
    const router = useRouter()

    /**
     * TODO: the routes should add parent route info in meta, includes name, path, parent route and so on, so the data get by route directly
     **/
    const breadcrumbData = reactive<{ path: string; name: RouteRecordName | undefined }[]>([
      {
        path: '/dashboard',
        name: 'my dashboard'
      }
    ])
    const getBreadcrumbData = () => {
      const r = route.matched.find(r => r.name && r.path)
      if (r) {
        breadcrumbData.push({
          name: r.name,
          path: r.path
        })
      }
    }

    const onLinkClick = (path: string) => {
      router.push(path)
    }

    watch(
      route,
      () => {
        getBreadcrumbData()
      },
      { immediate: true }
    )
    return () => (
      <>
        <div class="mb-10">
          <UBreadcrumb class="flex items-center">
            <UBreadcrumbItem
              v-slots={{
                separator: () => <ArrowLeftOutlined />
              }}
            ></UBreadcrumbItem>
            {breadcrumbData.map((item, index) => (
              <UBreadcrumbItem
                key={item.path}
                v-slots={{
                  separator: () => <ArrowLeftOutlined />
                }}
              >
                {index == breadcrumbData.length - 1 ? (
                  <span class="u-label2 uppercase text-primary">{item.name}</span>
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
