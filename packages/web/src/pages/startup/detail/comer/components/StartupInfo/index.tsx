import { UDrawer } from '@comunion/components'
import { ArrowRightOutlined } from '@comunion/icons'
import { defineComponent, PropType, ref } from 'vue'
import { StartupInfoItem } from './StartupInfoItem'
import { StartupItem } from '@/types'

const MAX_SHOW_COUNT = 8

export const StartupInfo = defineComponent({
  name: 'StartupInfo',
  props: {
    startups: {
      type: Array as PropType<StartupItem[]>
    }
  },
  setup(props, ctx) {
    const visibleStartups = ref(false)
    const showAllStartups = () => {
      visibleStartups.value = true
    }
    return () => (
      <div>
        <div class="flex">
          {props.startups?.slice(0, 8).map(startup => (
            <StartupInfoItem startupInfo={startup} />
          ))}
        </div>
        {(props.startups?.length || 0) > MAX_SHOW_COUNT && (
          <div
            class="flex justify-end items-center text-primary cursor-pointer"
            onClick={showAllStartups}
          >
            <span class="u-title2 mr-4 text-primary">View all</span>
            <ArrowRightOutlined />
          </div>
        )}
        <UDrawer
          title="TEAM"
          width={473}
          v-model:show={visibleStartups.value}
          v-slots={{
            whiteBoard: () => (
              <div class="mt-10 ml-11">
                {props.startups?.length
                  ? props.startups?.map(startup => <StartupInfoItem startupInfo={startup} />)
                  : null}
              </div>
            )
          }}
        ></UDrawer>
      </div>
    )
  }
})
