import { UCard, UDropdownFilter } from '@comunion/components'
import { defineComponent, ref, watch, onMounted, computed } from 'vue'

import { useConnector } from './useConnector'
import { useFollowComer } from './useFollowComer'
import { useFollowedStartups } from './useFollowedStartups'
import { useTabs } from './useTabs'
import { BasicItem } from '@/components/ListItem'
import LoadingBtn from '@/components/More/loading'
import StartupLogo from '@/components/StartupLogo'

export default defineComponent({
  name: 'ComerConnection',
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
    const followedStartups = computed(() => useFollowedStartups(props.comerId))
    const connector = computed(() => useConnector(props.comerId))
    const tabsInstance = computed(() => useTabs(props.comerId))
    const followComer = computed(() => useFollowComer(props.comerId))
    const currentTabId = ref<string>('0')

    const loadData = (id: string, reset = false) => {
      if (id === '0') {
        if (reset) followedStartups.value.reset()
        followedStartups.value.getFollowList()
      } else if (id === '1') {
        if (reset) followComer.value.reset()
        followComer.value.getFollowList()
      } else if (id === '2') {
        if (reset) connector.value.reset()
        connector.value.getConnector()
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

    const tabContents: { count: number; content?: JSX.Element }[] = [
      {
        count: this.followedStartups.list.value.length,
        content: (
          <>
            {this.followedStartups.list.value.length > 0 && (
              <>
                {this.followedStartups.list.value.map(item => {
                  return (
                    <BasicItem
                      class="-mx-4"
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
                            class="cursor-pointer flex h-12 w-12 items-center overflow-hidden"
                            onClick={() => this.$router.push(`/startup/${item.startupId}`)}
                          >
                            <StartupLogo src={item.startupLogo} />
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
                      return `More(${this.tabsInstance.tabs.value[0].totalRows})`
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
                      class="-mx-4"
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
                            class="cursor-pointer flex h-12 w-12 "
                            onClick={() =>
                              this.$router.push({ path: '/comer', query: { id: item.comerId } })
                            }
                          >
                            <StartupLogo src={item.comerAvatar} />
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
                      return `More(${this.tabsInstance.tabs.value[1].totalRows})`
                    }
                  }}
                />
              </div>
            )}
          </>
        )
      },
      {
        count: this.connector.list.value.length,
        content: (
          <>
            {this.connector.list.value.length > 0 && (
              <>
                {this.connector.list.value.map(item => {
                  return (
                    <BasicItem
                      class="-mx-4"
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
                            class="cursor-pointer flex h-12 w-12 items-center overflow-hidden"
                            onClick={() =>
                              this.$router.push({ path: '/comer', query: { id: item.comerId } })
                            }
                          >
                            <StartupLogo src={item.comerAvatar} />
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
                      return `More(${this.tabsInstance.tabs.value[2].totalRows})`
                    }
                  }}
                />
              </div>
            )}
          </>
        )
      }
    ]

    return !this.view ||
      this.tabsInstance.tabs.value.filter((item: any) => item.totalRows > 0).length > 0 ? (
      <UCard
        title="Connection"
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
    ) : null
  }
})
