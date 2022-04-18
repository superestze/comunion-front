import { UDeveloping, UTabPane, UTabs } from '@comunion/components'
import { UPagination } from '@comunion/components/src'
import { defineComponent, onMounted, ref } from 'vue'
import StartupCard from '@/pages/welcome/components/StartupCard'
import { services } from '@/services'
import { StartupItem } from '@/types'

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
    const getRecommendStartups = async () => {
      const { error, data } = await services['startup@startup-list']({
        limit: pagination.value.pageSize,
        offset: pagination.value.pageSize * (pagination.value.page - 1)
      })
      if (!error) {
        startups.value = [...data.list]
        console.log('startups.value:::', startups.value)
        total.value = data.total
      }
    }

    const updatePage = (page: number) => {
      pagination.value.page = page
      getRecommendStartups()
    }

    onMounted(() => {
      getRecommendStartups()
    })
    return () => (
      <>
        <section class="recommend p-10 bg-white">
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
                  <UPagination
                    v-model:page={pagination.value.page}
                    itemCount={total.value}
                    v-model:pageSize={pagination.value.pageSize}
                    on-update:page={updatePage}
                  />
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
