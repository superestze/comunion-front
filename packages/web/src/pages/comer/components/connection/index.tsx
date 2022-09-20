import { UCard, UDropdownFilter } from '@comunion/components'
import { defineComponent, ref, watch, onMounted } from 'vue'

import { useConnector } from './useConnector'
import { useFollowComer } from './useFollowComer'
import { useFollowedStartups } from './useFollowedStartups'
import { useTabs } from './useTabs'
import { BasicItem } from '@/components/ListItem'
import LoadingBtn from '@/components/More/loading'
import UStartupLogo from '@/components/UStartupLogo'

export default defineComponent({
  props: {
    view: {
      type: Boolean,
      default: () => false
    },
    comerId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const followedStartups = useFollowedStartups(props.comerId)
    const connector = useConnector(props.comerId)
    const tabsInstance = useTabs(props.comerId)
    const followComer = useFollowComer(props.comerId)
    const currentTabId = ref<string>('0')

    const loadData = (id: string, reset = false) => {
      if (id === '0') {
        if (reset) followedStartups.reset()
        followedStartups.getFollowList()
      } else if (id === '1') {
        if (reset) followComer.reset()
        followComer.getFollowList()
      } else if (id === '2') {
        if (reset) connector.reset()
        connector.getConnector()
      }
    }

    watch(
      () => currentTabId.value,
      id => loadData(id, true)
    )

    onMounted(() => {
      loadData(currentTabId.value)
    })

    return {
      followedStartups,
      followComer,
      connector,
      tabsInstance,
      currentTabId
    }
  },
  render() {
    const handleMore = () => {
      if (this.currentTabId === '0') {
        this.followedStartups.page.value += 1
        this.followedStartups.getFollowList()
      } else if (this.currentTabId === '1') {
        this.followComer.page.value += 1
        this.followComer.getFollowList()
      } else if (this.currentTabId === '2') {
        this.connector.page.value += 1
        this.connector.getConnector()
      }
    }

    const handleConnect = (item: any) => {
      if (this.currentTabId === '0') {
        this.followedStartups.connect(item.startupId, item.cb)
      } else if (this.currentTabId === '1') {
        this.followComer.connect(item.comerId, item.cb)
      } else if (this.currentTabId === '2') {
        this.connector.connect(item.comerId, item.cb)
      }
    }

    const handleUnConnect = (item: any) => {
      if (this.currentTabId === '0') {
        this.followedStartups.unconnect(item.startupId, item.cb)
      } else if (this.currentTabId === '1') {
        this.followComer.unconnect(item.comerId, item.cb)
      } else if (this.currentTabId === '2') {
        this.connector.unconnect(item.comerId, item.cb)
      }
    }

    const tabContents = [
      {
        count: this.followedStartups.list.value.length,
        content: (
          <>
            {this.followedStartups.list.value.length > 0 && (
              <>
                {this.followedStartups.list.value.map(item => {
                  return (
                    <BasicItem
                      item={item}
                      onConnect={handleConnect}
                      onUnconnect={handleUnConnect}
                      keyMap={{
                        name: 'startupName',
                        follow: 'followedByMe'
                      }}
                      v-slots={{
                        avatar: () => (
                          <div
                            class="cursor-pointer flex h-11 w-11 items-center overflow-hidden"
                            onClick={() => this.$router.push(`/startup/${item.startupId}`)}
                          >
                            <UStartupLogo src={item.startupLogo} />
                          </div>
                        )
                      }}
                    />
                  )
                })}
              </>
            )}
            {this.followedStartups.total.value > 5 && (
              <div class="flex mt-5 justify-center">
                <LoadingBtn
                  onMore={handleMore}
                  end={this.followedStartups.list.value.length >= this.followedStartups.total.value}
                  v-slots={{
                    text: () => {
                      return `More${this.tabsInstance.tabs.value[0].subTitle}`
                    }
                  }}
                />
              </div>
            )}
          </>
        )
      },
      {
        count: this.followComer.list.value.length,
        content: (
          <>
            {this.followComer.list.value.length > 0 && (
              <>
                {this.followComer.list.value.map(item => {
                  return (
                    <BasicItem
                      item={item}
                      onConnect={handleConnect}
                      onUnconnect={handleUnConnect}
                      keyMap={{
                        name: 'comerName',
                        follow: 'followedByMe'
                      }}
                      v-slots={{
                        avatar: () => (
                          <div
                            class="cursor-pointer flex h-11 w-11 "
                            onClick={() =>
                              this.$router.push({ path: '/comer', query: { id: item.comerId } })
                            }
                          >
                            <UStartupLogo src={item.comerAvatar} />
                          </div>
                        )
                      }}
                    />
                  )
                })}
              </>
            )}
            {this.followComer.total.value > 5 && (
              <div class="flex mt-5 justify-center">
                <LoadingBtn
                  onMore={handleMore}
                  end={this.followComer.list.value.length >= this.followComer.total.value}
                  v-slots={{
                    text: () => {
                      return `More${this.tabsInstance.tabs.value[1].subTitle}`
                    }
                  }}
                />
              </div>
            )}
          </>
        )
      },
      {
        cont: this.connector.list.value.length,
        content: (
          <>
            {this.connector.list.value.length > 0 && (
              <>
                {this.connector.list.value.map(item => {
                  return (
                    <BasicItem
                      item={item}
                      onConnect={handleConnect}
                      onUnconnect={handleUnConnect}
                      keyMap={{
                        name: 'comerName',
                        follow: 'followedByMe'
                      }}
                      v-slots={{
                        avatar: () => (
                          <div
                            class="cursor-pointer flex h-11 w-11 items-center overflow-hidden"
                            onClick={() =>
                              this.$router.push({ path: '/comer', query: { id: item.comerId } })
                            }
                          >
                            <UStartupLogo src={item.comerAvatar} />
                          </div>
                        )
                      }}
                    />
                  )
                })}
              </>
            )}
            {this.connector.total.value > 5 && (
              <div class="flex mt-5 justify-center">
                <LoadingBtn
                  onMore={handleMore}
                  end={this.connector.list.value.length >= this.connector.total.value}
                  v-slots={{
                    text: () => {
                      return `More${this.tabsInstance.tabs.value[2].subTitle}`
                    }
                  }}
                />
              </div>
            )}
          </>
        )
      }
    ]

    return (
      <UCard
        title="Connected"
        class="mb-6"
        v-slots={{
          'header-extra': () => {
            return (
              <UDropdownFilter
                options={this.tabsInstance.tabs.value.map(item => ({
                  label: `${item.title}`,
                  value: item.id
                }))}
                class="w-28"
                v-model:value={this.currentTabId}
                consistent-menu-width={false}
              />
            )
          }
        }}
      >
        {tabContents[Number(this.currentTabId)] && tabContents[Number(this.currentTabId)].content}
      </UCard>
    )
  }
})
