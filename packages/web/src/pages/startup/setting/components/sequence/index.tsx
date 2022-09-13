import { UButton, USpin, message } from '@comunion/components'
import { PropType, defineComponent, ref, watch } from 'vue'
import { BasicSortable } from '@/components/sortable'
import { services } from '@/services'

type DataType = {
  tabSequence: number[]
}

export default defineComponent({
  name: 'sequenceSetting',
  props: {
    data: {
      type: Object as PropType<DataType>,
      required: true
    },
    startupId: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const loading = ref(false)

    const list = ref<number[]>(props.data.tabSequence)
    watch(
      () => props.data,
      data => {
        list.value = data.tabSequence
      }
    )

    return {
      loading,
      list
    }
  },
  render() {
    const handleSubmit = async () => {
      if (!this.startupId) {
        return console.warn(`this.startupId is missing!`)
      }
      // loading
      this.loading = true
      await services['startup@update-sequnce']({
        startupID: String(this.startupId),
        tabs: this.list
      })
      this.loading = false
      message.success('successfully saved')
    }
    return (
      <USpin show={this.loading}>
        <div class="bg-white border rounded-lg mb-6 min-h-205.5 relative overflow-hidden">
          <div class="my-9.5 mx-10">
            <h3 class="mb-10 u-h3">
              Show each activities in startup detail according to the following sequence
            </h3>
            <BasicSortable v-model={this.list} />
            <div class="flex mt-10 items-center justify-end">
              <UButton class="w-30" type="primary" size="small" onClick={handleSubmit}>
                Save
              </UButton>
            </div>
          </div>
        </div>
      </USpin>
    )
  }
})
