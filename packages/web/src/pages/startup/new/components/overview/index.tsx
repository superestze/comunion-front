import { UCard } from '@comunion/components'
import { defineComponent, ref, onMounted } from 'vue'
import More from '@/components/More/shadow'

export default defineComponent({
  props: {
    content: {
      type: String,
      required: true
    }
  },
  setup() {
    const pRef = ref<any>()
    const showMoreBtn = ref<boolean>()

    onMounted(() => {
      setTimeout(() => {
        console.log(pRef.value.scrollHeight)
        if (pRef.value.scrollHeight > 162) {
          showMoreBtn.value = true
        }
      }, 500)
    })

    const fold = ref<boolean>(true)
    return {
      fold,
      pRef,
      showMoreBtn
    }
  },
  render() {
    const handleMore = () => {
      this.fold = !this.fold
    }
    return (
      <>
        {this.content.trim() === '' ? null : (
          <UCard title="OVERVIEW" class="mb-6">
            <div
              class="transition-all ease-linear duration-1000 overflow-hidden"
              style={{ height: this.fold ? '162px' : 'auto' }}
            >
              <p class="u-body2" ref={(ref: any) => (this.pRef = ref)} v-html={this.content} />
            </div>
            {this.showMoreBtn && (
              <div class="flex mt-5 justify-center">
                <More onMore={handleMore} fold={this.fold} />
              </div>
            )}
          </UCard>
        )}
      </>
    )
  }
})
