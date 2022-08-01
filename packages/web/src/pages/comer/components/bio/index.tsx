import { UCard, UScrollbar } from '@comunion/components'
import { defineComponent, computed, ref, onMounted } from 'vue'
import flip from '../animate/flip.module.css'
import Edit from '../edit'
import More from '@/components/More'

export default defineComponent({
  props: {
    content: {
      type: String,
      default: () => '',
      required: true
    }
  },
  setup() {
    const edit = ref<boolean>(false)
    const wrapperClass = computed(() => {
      const str = 'bg-white rounded-lg border mb-6 relative overflow-hidden'
      if (edit.value) {
        return `${str} ${flip['flip-vertical-right']}`
      }
      return `${str} ${flip['flip-vertical-left']}`
    })

    const pRef = ref<any>()
    const showMoreBtn = ref<boolean>()

    onMounted(() => {
      console.dir(pRef.value)
      console.log(pRef.value.scrollHeight, pRef.value.offsetHeight)
      if (pRef.value.scrollHeight > pRef.value.offsetHeight) {
        showMoreBtn.value = true
      }
    })

    const fold = ref<boolean>(true)
    return {
      wrapperClass,
      edit,
      pRef,
      showMoreBtn,
      fold
    }
  },
  render() {
    const handleEditMode = () => {
      this.edit = !this.edit
    }
    const handleMore = () => {
      this.fold = !this.fold
    }
    return (
      <UCard
        title="BIO"
        class="mb-6"
        v-slots={{
          'header-extra': () => <Edit onHandleClick={handleEditMode} />
        }}
      >
        <UScrollbar class="max-h-163px">
          <p ref={(ref: any) => (this.pRef = ref)}>{this.content}</p>
        </UScrollbar>
        {this.showMoreBtn && (
          <div class="flex justify-end mt-20px">
            <More onMore={handleMore} fold={this.fold} />
          </div>
        )}
      </UCard>
    )
  }
})
