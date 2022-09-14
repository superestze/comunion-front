import { defineComponent } from 'vue'
import Avatar from '@/components/Avatar'

export default defineComponent({
  props: {
    avatar: {
      type: String,
      default: () => 'https://comunion-avatars.s3.ap-northeast-1.amazonaws.com/avatar1.svg'
    },
    comerId: {
      type: String,
      require: true
    }
  },
  render() {
    const toComerDetail = (id: string) => () => {
      this.$router.push({ path: '/comer', query: { id } })
    }
    return (
      <div class="flex">
        <Avatar
          class="!h-11 !w-11"
          avatar={this.avatar}
          onClickAvatar={toComerDetail(this.comerId as string)}
        />
        {this.$slots.default ? this.$slots.default() : null}
      </div>
    )
  }
})
