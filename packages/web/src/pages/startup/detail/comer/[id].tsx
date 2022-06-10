import { UBreadcrumb, UBreadcrumbItem, UCard, ULazyImage, USpin } from '@comunion/components'
import { ArrowLeftOutlined } from '@comunion/icons'
import { defineComponent, ref } from 'vue'
import router from '@/router'

const ComerDetail = defineComponent({
  name: 'ComerDetail',
  setup() {
    const pageLoading = ref(false)
    return {
      pageLoading
    }
  },
  render() {
    return (
      <USpin show={this.pageLoading}>
        <UBreadcrumb class="mt-10 mb-10">
          <UBreadcrumbItem v-slots={{ separator: () => <ArrowLeftOutlined /> }} />
          <UBreadcrumbItem v-slots={{ separator: () => <ArrowLeftOutlined /> }}>
            <span
              class="cursor-pointer text-primary uppercase u-label2"
              onClick={() => {
                router.back()
              }}
            >
              STARTUP DETAIL
            </span>
          </UBreadcrumbItem>
          <UBreadcrumbItem v-slots={{ separator: () => <ArrowLeftOutlined /> }}>
            <span class="cursor-pointer text-primary uppercase u-label2">Comer Detail</span>
          </UBreadcrumbItem>
        </UBreadcrumb>
        <div class="flex gap-6">
          <section class="basis-1/3">
            <UCard class="mb-6 !pb-8">
              <ULazyImage src={''} class="h-16 w-16 rounded-1\/2" />
            </UCard>
          </section>
          <section class="basis-2/3">
            <UCard title="Startup" class="mb-6 !pb-8"></UCard>
            <UCard title="Bounty" class="mb-6 !pb-8"></UCard>
          </section>
        </div>
      </USpin>
    )
  }
})

export default ComerDetail
