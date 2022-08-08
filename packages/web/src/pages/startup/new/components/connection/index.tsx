import { UCard, ULazyImage } from '@comunion/components'
import { defineComponent, computed } from 'vue'
import { BasicItem } from '@/components/ListItem'
import LoadingBtn from '@/components/More/loading'

export default defineComponent({
  setup() {
    const title = computed(() => {
      return `CONNECTIONS（203）`
    })
    const test = [
      {
        avatar: 'https://comunion-avatars.s3.ap-northeast-1.amazonaws.com/avatar1.svg',
        name: '123123'
      },
      {
        avatar: 'https://comunion-avatars.s3.ap-northeast-1.amazonaws.com/avatar1.svg',
        name: '123123'
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
