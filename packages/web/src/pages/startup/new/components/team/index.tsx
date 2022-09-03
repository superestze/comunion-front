import { UCard, ULazyImage } from '@comunion/components'
import { defineComponent, computed, watch, ref, PropType } from 'vue'
import { editComerData } from '../../setting/components/team/addTeamMemberDialog'
import defaultAvatar from '../../setting/components/team/assets/avatar.png?url'
import { BasicItem } from '@/components/ListItem'
import LoadingBtn from '@/components/More/loading'

export default defineComponent({
  props: {
    members: {
      type: Object as PropType<editComerData[]>
    }
  },
  setup(props) {
    const list = ref<any[]>([])

    watch(
      () => props.members,
      () => {
        list.value = props.members || []
      },
      {
        immediate: true
      }
    )

    const title = computed(() => {
      return `TEAM（${list.value.length}）`
    })

    return {
      title,
      list
    }
  },
  render() {
    const handleConnect = (item: any) => {
      // todo
    }

    const handleUnConnect = (item: any) => {
      // todo
    }

    const handleMore = () => {
      // todo
    }

    return (
      <UCard title={this.title} class="mb-6">
        {this.list.map(item => (
          <BasicItem
            item={item}
            onConnect={handleConnect}
            onUnconnect={handleUnConnect}
            v-slots={{
              avatar: () => (
                <div class="flex h-9 w-9 items-center overflow-hidden">
                  <ULazyImage src={item.comerAvatar || defaultAvatar} />
                </div>
              ),
              content: () => (
                <div class="flex flex-col">
                  <p class="font-600 w-full text-16px text-grey1">{item.comerName}</p>
                  <p class="font-400 mt-1 w-full text-12px text-grey3">{item.position}</p>
                </div>
              )
            }}
          />
        ))}
        <div class="flex mt-5 justify-center">
          <LoadingBtn onMore={handleMore} end={false} />
        </div>
      </UCard>
    )
  }
})
