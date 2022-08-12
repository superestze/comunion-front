import { UCard, ULazyImage } from '@comunion/components'
import { defineComponent, computed } from 'vue'
import { BasicItem } from '@/components/ListItem'
import LoadingBtn from '@/components/More/loading'

export default defineComponent({
  setup() {
    const title = computed(() => {
      return `TEAM（18）`
    })
    const test = [
      {
        avatar: 'https://comunion-avatars.s3.ap-northeast-1.amazonaws.com/avatar1.svg',
        name: '123123',
        subName: '123123'
      },
      {
        avatar: 'https://comunion-avatars.s3.ap-northeast-1.amazonaws.com/avatar1.svg',
        name: '123123',
        subName: '123123'
      }
    ]
    return {
      title,
      test
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
        {this.test.map(item => (
          <BasicItem
            item={item}
            onConnect={handleConnect}
            onUnconnect={handleUnConnect}
            v-slots={{
              avatar: () => (
                <div class="flex items-center w-9 h-9 overflow-hidden">
                  <ULazyImage src={item.avatar} />
                </div>
              ),
              content: () => (
                <div class="flex flex-col">
                  <p class="w-full text-16px font-600 text-grey1">{item.name}</p>
                  <p class="w-full text-12px font-400 text-grey3 mt-1">{item.subName}</p>
                </div>
              )
            }}
          />
        ))}
        <div class="flex justify-center mt-5">
          <LoadingBtn onMore={handleMore} end={false} />
        </div>
      </UCard>
    )
  }
})
