import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import Avatar from '@/components/Avatar'

export default defineComponent({
  props: {
    avatar: {
      type: String,
      default: () => 'https://comunion-avatars.s3.ap-northeast-1.amazonaws.com/avatar1.svg'
    }
  },
  setup() {
    const router = useRouter()
    const toComerDetail = (id: string) => () => {
      router.push({ path: `/startup/detail/comer/${id}` })
    }
    return {
      toComerDetail
    }
  },
  render() {
    return (
      <div class="flex">
        <Avatar class="flex-shrink-0" avatar={this.avatar} onClickAvatar={this.toComerDetail('')} />
        {/* <div class="flex-grow-1"> */}
        {this.$slots.default
          ? this.$slots.default({
              name: 'asdfasdfsf',
              time: '123123',
              money: 123123,
              content: 'content,content,content'
            })
          : null}
        {/* </div> */}
      </div>
    )
  }
})
