import { UCard, ULazyImage } from '@comunion/components'
import { defineComponent, computed, watch, ref, PropType } from 'vue'
import { BasicItem } from '@/components/ListItem'
import LoadingBtn from '@/components/More/loading'

type followItem = {
  comerID: number
  startupID: number
  name?: string
  avatar?: string
}

export default defineComponent({
  props: {
    follows: {
      type: Object as PropType<followItem[]>
    }
  },
  setup(props) {
    const list = ref<followItem[]>([])

    watch(
      () => props.follows,
      () => {
        list.value = props.follows || []
      },
      {
        immediate: true
      }
    )

    const title = computed(() => {
      return `CONNECTIONS（${list.value.length}）`
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
                <div class="flex h-9 w-9 items-center overflow-hidden">
                  <ULazyImage src={item.avatar} />
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
