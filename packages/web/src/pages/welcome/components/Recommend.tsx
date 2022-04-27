import { UDeveloping, UTabPane, UTabs } from '@comunion/components'
import { defineComponent, onMounted, ref, provide } from 'vue'
import MPagination from './MPagination'
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
      pageSize: 8,
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
        <section class="recommend p-10 bg-white" ref="Recommend">
          <div class="font-orbitron font-style font-700 text-[18px] leading-6 tracking-2px uppercase text-primary mb-11">
            Recommended for you
          </div>
          <div class="content">
            <UTabs>
              <UTabPane name="Startups" tab="STARTUPS">
                {startups.value.length !== 0 ? (
                  startups.value.map(startup => <StartupCard startup={startup} />)
                ) : (
                  <UDeveloping />
                )}
                <div class="u-paginated-list mt-3">
                  {pageList.total && (
                    <MPagination
                      pageList={pageList}
                      v-model:updatePage={updatePage}
                      ref="pageList"
                    />
                  )}
                </div>
              </UTabPane>
            </UTabs>
          </div>
        </section>
      </>
    )
  }
})

export default Recommend
