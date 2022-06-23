import { UDrawer } from '@comunion/components'
import { ArrowRightOutlined } from '@comunion/icons'
import { defineComponent, ref, onMounted, PropType } from 'vue'
import { useRouter } from 'vue-router'
import { StartupInfoItem } from './StartupInfoItem'
import { ServiceReturn, services } from '@/services'

const MAX_SHOW_COUNT = 2

export const StartupInfo = defineComponent({
  name: 'StartupInfo',
  props: {
    comerId: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup(props, ctx) {
    const router = useRouter()
    const visibleStartups = ref(false)
    const startups = ref<ServiceReturn<'startup@startup-list-be-member'>>()
    const showAllStartups = () => {
      getStartupByComerId(startups.value?.total)
      visibleStartups.value = true
    }
    const getStartupByComerId = async (limit = 8) => {
      const { error, data } = await services['startup@startup-list-be-member']({
        comerId: props.comerId,
        limit,
        offset: 0
      })

      if (!error) {
        startups.value = data
      }
    }
    onMounted(() => {
      getStartupByComerId()
    })
    const toStartupDetail = (startupId: number) => {
      router.push(`/startup/detail?startupId=${startupId}`)
    }
    return {
      startups,
      visibleStartups,
      showAllStartups,
      toStartupDetail
    }
  },
  render() {
    return (
      <div>
        <div class="flex flex-wrap pt-10">
          {this.startups?.list.slice(0, 8).map(startup => (
            <div
              class="basis-1/2 mb-10 truncate cursor-pointer"
              onClick={() => this.toStartupDetail(startup.id)}
            >
              <StartupInfoItem key={startup.id} startupInfo={startup} />
            </div>
          ))}
        </div>
        {(this.startups?.total || 0) > MAX_SHOW_COUNT && (
          <div
            class="flex justify-end items-center text-primary cursor-pointer"
            onClick={this.showAllStartups}
          >
            <span class="u-title2 mr-2 text-primary">View all</span>
            <ArrowRightOutlined class="text-xs" />
          </div>
        )}
        <UDrawer
          title="STARTUP"
          width={473}
          v-model:show={this.visibleStartups}
          v-slots={{
            whiteBoard: () => (
              <div class="mt-10 ml-11">
                {this.startups?.list.length
                  ? this.startups?.list.map(startup => (
                      <div
                        class="mb-10 cursor-pointer"
                        onClick={() => this.toStartupDetail(startup.id)}
                      >
                        <StartupInfoItem startupInfo={startup} />
                      </div>
                    ))
                  : null}
              </div>
            )
          }}
        ></UDrawer>
      </div>
    )
  }
})
