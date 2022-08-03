import { UCard, UStartupLogo } from '@comunion/components'
import { defineComponent, ref, watch, onMounted } from 'vue'
import ListItem from './listItem'

import Switch from './switch'
import { useFollowedStartups } from './useFollowedStartups'
import LoadingBtn from '@/components/More/loading'

export default defineComponent({
  setup() {
    const followedStartups = useFollowedStartups()
    const currentTabId = ref<string>('0')

    const loadData = (id: string) => {
      if (id === '0') {
        followedStartups.getFollowList(0)
      } else if (id === '1') {
        // todo
      } else if (id === '2') {
        // todo
      }
    }

    watch(() => currentTabId.value, loadData)

    onMounted(() => {
      loadData(currentTabId.value)
    })

    return {
      followedStartups,
      currentTabId
    }
  },
  render() {
    console.log(this.followedStartups)
    const tabsChange = (id: string) => {
      this.currentTabId = id
    }
    const handleMore = () => {
      if (this.currentTabId === '0') {
        this.followedStartups.offset.value += 5
        this.followedStartups.getFollowList(this.followedStartups.offset.value)
      }
    }

    const handleConnect = (item: any) => {
      if (this.currentTabId === '0') {
        this.followedStartups.connect(item.id, item.cb)
      }
    }

    const handleUnConnect = (item: any) => {
      if (this.currentTabId === '0') {
        this.followedStartups.unconnect(item.id, item.cb)
      }
    }
    return (
      <UCard title="CONNECTED" class="mb-6">
        <div class="flex flex-col mt-6">
          <Switch onSwitchPanel={tabsChange} currentId={this.currentTabId} />
          <div class="flex flex-col">
            {Array.isArray(this.followedStartups.list) &&
              this.followedStartups.list.map(item => {
                console.log(item)
                return (
                  <ListItem
                    item={item}
                    onConnect={handleConnect}
                    onUnconnect={handleUnConnect}
                    v-slots={{
                      avatar: () => (
                        <div class="flex items-center">
                          <UStartupLogo src={item.logo} width="9" height="9" />
                        </div>
                      )
                    }}
                  />
                )
              })}
            <div class="flex justify-center mt-5">
              <LoadingBtn
                onMore={handleMore}
                end={(this.followedStartups.list?.length || 0) >= this.followedStartups.total}
              />
            </div>
          </div>
        </div>
      </UCard>
    )
  }
})
