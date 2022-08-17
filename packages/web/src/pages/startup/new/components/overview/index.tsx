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
        if (pRef.value.scrollHeight > 164) {
          showMoreBtn.value = true
        }
      }, 1000)
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
              class="overflow-hidden transition-all duration-1000 ease-linear"
              style={{ height: this.fold ? '164px' : 'auto' }}
            >
              <p ref={(ref: any) => (this.pRef = ref)} v-html={this.content} />
            </div>
            {this.showMoreBtn && (
              <div class="flex justify-center mt-5">
                <More onMore={handleMore} fold={this.fold} />
              </div>
            )}
          </UCard>
        )}
      </>
    )
  }
})
