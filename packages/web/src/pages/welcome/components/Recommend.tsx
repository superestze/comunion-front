import { UTabPane, UTabs, UScrollbar } from '@comunion/components'
import { defineComponent, onMounted, ref, provide } from 'vue'
import StartupCard from '@/pages/welcome/components/StartupCard'
import { services } from '@/services'
import { StartupItem } from '@/types'
export const root = ref(null)

const Recommend = defineComponent({
  name: 'Recommend',
  setup(props, ctx) {
    const total = ref<number>()
    const startups = ref<StartupItem[]>([])
    // TODO: use load more component
    const pagination = ref({
      pageSize: 99,
      page: 1
    })
    const pageList = {
      page: 1,
      pageSize: 8,
      total: 0
    }
    const getRecommendStartups = async () => {
      const { error, data } = await services['startup@startup-list']({
        limit: pagination.value.pageSize,
        offset: pagination.value.pageSize * (pagination.value.page - 1)
      })
      if (!error) {
        startups.value = data!.list
        console.log('startups.value:::', startups.value)
        total.value = data!.total
        pageList.total = total.value
      }
    }

    const updatePage = (page: number) => {
      pagination.value.page = page
      getRecommendStartups()
    }
    const PARENT_PROVIDE = 'parentProvide'
    provide(PARENT_PROVIDE, root)

    provide(`${PARENT_PROVIDE}/updatePage`, updatePage)

    onMounted(() => {
      getRecommendStartups()
    })
    return () => (
      <>
        <section class="bg-white h-234 recommend " ref="Recommend">
          <div class="mb-7 px-10 pt-10 text-primary1 u-card-title1">RECOMMENDED FOR YOU</div>
          <div class="content relative">
            <UTabs tab-style={{ 'font-weight': '700' }} class="px-10">
              <UTabPane name="Startups" tab="STARTUPS">
                <UScrollbar class="h-185 right-0 absolute">
                  <div class="px-10">
                    {startups.value.map(startup => (
                      <StartupCard startup={startup} />
                    ))}
                    {/* <div class="mt-3 u-paginated-list">
                    {pageList.total && (
                      <MPagination
                        pageList={pageList}
                        v-model:updatePage={updatePage}
                        ref="pageList"
                      />
                    )}
                  </div> */}
                  </div>
                </UScrollbar>
              </UTabPane>
            </UTabs>
          </div>
        </section>
      </>
    )
  }
})

export default Recommend
