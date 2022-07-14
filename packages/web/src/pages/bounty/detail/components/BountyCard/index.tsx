import { UTag } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import Paragraph from './paragraph'
import More from '@/components/More'
import { StretchTags } from '@/components/Tags'

export default defineComponent({
  setup() {
    const fold = ref<boolean>(true)
    const handleMore = () => {
      fold.value = !fold.value
    }
    return {
      handleMore,
      fold
    }
  },
  render() {
    return (
      <div>
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class="u-h2">Design- Create A Vector For the bounty wihit earn...</span>
            <StretchTags />
          </div>
          <div class="">
            <UTag
              class="ml-5 text-12px w-110px"
              type="outlined"
              style={{
                color: '#00BFA5'
              }}
            >
              Ready To Work
            </UTag>
          </div>
        </div>
        <Paragraph
          class="mt-40px"
          label="Created :"
          content="2 days ago"
          contentClass="text-primary2"
        />
        <Paragraph
          class="mt-18px"
          label="Created :"
          content="2 days ago"
          contentClass="text-primary"
          pasteboard={true}
        />
        <Paragraph
          class="mt-18px"
          label="Created :"
          content="asdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadfasdkfjslfjlsadf"
          foldAble={true}
          fold={this.fold}
          maxHeight={300}
          contentClass="text-primary2"
        />
        <div class="flex justify-end mt-20px">
          <More onMore={this.handleMore} fold={this.fold} />
        </div>
      </div>
    )
  }
})
