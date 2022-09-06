import { UCard, ULazyImage } from '@comunion/components'
import { defineComponent, computed, ref } from 'vue'
import { BasicItem } from '@/components/ListItem'
import LoadingBtn from '@/components/More/loading'
import { useComer } from '@/pages/comer/hooks/comer'
import defaultAvatar from '@/pages/startup/setting/components/team/assets/avatar.png?url'
import { ServiceReturn, services } from '@/services'
type MemberType = NonNullable<ServiceReturn<'startup@startup-fans'>>['rows']

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

    services['startup@startup-fans']({
      startupID: props.startupId,
      limit: 99,
      page: 1
    }).then(res => {
      if (!res.error) {
        list.value = res.data?.rows
      }
    })

    const title = computed(() => {
      return `CONNECTIONS（${list.value?.length || 0}）`
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

    const fullList = this.list || []
    const listData = this.maxShowNumber ? fullList.slice(0, this.maxShowNumber) : fullList

    return (
      <UCard title={this.title} class="mb-6">
        {listData.map(item => (
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
                <div class="flex h-9 w-9 items-center overflow-hidden">
                  <ULazyImage src={item.comerAvatar || defaultAvatar} />
                </div>
              )
            }}
          />
        ))}
        {this.maxShowNumber > 0 && fullList.length > this.maxShowNumber && (
          <div class="flex mt-5 justify-center">
            <LoadingBtn onMore={handleMore} end={false} />
          </div>
        )}
      </UCard>
    )
  }
})
