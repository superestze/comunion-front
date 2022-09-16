import { UCard, ULazyImage } from '@comunion/components'
import { defineComponent, computed, ref } from 'vue'
import { BasicItem } from '@/components/ListItem'
import LoadingBtn from '@/components/More/loading'
import { useComer } from '@/pages/comer/hooks/comer'
import defaultAvatar from '@/pages/startup/setting/components/team/assets/avatar.png?url'
import { services, ServiceReturn } from '@/services'
type MemberType = NonNullable<ServiceReturn<'startup@start-team-meabers-list'>>['list']

export default defineComponent({
  props: {
    startupId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const maxShowNumber = ref(5)
    const list = ref<MemberType>([])

    services['startup@start-team-meabers-list']({
      startupId: props.startupId,
      limit: 99,
      offset: 0
    }).then(res => {
      if (!res.error) {
        list.value = res.data?.list
      }
    })

    const title = computed(() => {
      return `Team（${list.value.length}）`
    })

    return {
      title,
      list,
      maxShowNumber
    }
  },
  render() {
    const handleConnect = async (item: any) => {
      const comerService = useComer(item.comerId)
      const { error } = await comerService.follow()
      if (!error) {
        typeof item.cb === 'function' && item.cb()
      }
    }

    const handleUnConnect = async (item: any) => {
      const comerService = useComer(item.comerId)
      const { error } = await comerService.unfollow()
      if (!error) {
        typeof item.cb === 'function' && item.cb()
      }
    }

    const handleMore = () => {
      this.maxShowNumber = 0
    }

    const listData = this.maxShowNumber ? this.list.slice(0, this.maxShowNumber) : this.list

    return (
      <UCard title={this.title} class="mb-6">
        {listData.map(item => (
          <BasicItem
            item={{
              comerId: item.comerID,
              comerName: item.comerProfile?.name,
              followedByMe: item.followedByMe
            }}
            onConnect={handleConnect}
            onUnconnect={handleUnConnect}
            keyMap={{
              name: 'comerName',
              follow: 'followedByMe'
            }}
            v-slots={{
              avatar: () => (
                <div
                  class="cursor-pointer flex h-9 w-9 items-center overflow-hidden"
                  onClick={() => this.$router.push({ path: '/comer', query: { id: item.comerID } })}
                >
                  <ULazyImage src={item.comerProfile?.avatar || defaultAvatar} />
                </div>
              ),
              content: () => (
                <div class="flex-1 overflow-hidden">
                  <p class="text-grey1 truncate u-h4">{item.comerProfile?.name}</p>
                  <p class="u-h7 truncate !px-0 !text-grey3">{item.comerProfile?.location}</p>
                </div>
              )
            }}
          />
        ))}
        {this.maxShowNumber > 0 && this.list.length > this.maxShowNumber && (
          <div class="flex mt-5 justify-center">
            <LoadingBtn onMore={handleMore} end={false} />
          </div>
        )}
      </UCard>
    )
  }
})
