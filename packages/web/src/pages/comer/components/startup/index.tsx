import { UCard } from '@comunion/components'
import { defineComponent, reactive, ref, watch } from 'vue'
import StartupCard from './StartupCard'
import { services } from '@/services'
import { StartupItem } from '@/types'
import '@/assets/style/last-item-noborder.css'

export default defineComponent({
  props: {
    createdByMe: {
      type: Boolean,
      default: () => true
    },
    comerId: {
      type: Number,
      required: true
    },
    view: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props) {
    const pagination = reactive<{
      pageSize: number
      total: number
      page: number
      loading: boolean
    }>({
      pageSize: 999,
      total: 0,
      page: 1,
      loading: false
    })

    const startups = ref<StartupItem[]>([])

    const getStartups = async () => {
      const { error, data } = await services[
        props.createdByMe
          ? 'startup@comer-posted-startup-list'
          : 'startup@comer-participated-startup-list'
      ]({
        limit: pagination.pageSize,
        offset: pagination.pageSize * (pagination.page - 1),
        keyword: undefined,
        mode: undefined,
        comerID: props.comerId
      })
      if (!error) {
        startups.value.push(...(data!.list as unknown as StartupItem[]))
        pagination.total = data!.total
      }
    }

    watch(
      () => props.createdByMe,
      () => {
        pagination.loading = true
        pagination.page = 1
        pagination.pageSize = 999
        pagination.total = 0
        startups.value = []
        getStartups()
      },
      { immediate: true }
    )

    return {
      pagination,
      startups,
      getStartups
    }
  },
  render() {
    return (
      <UCard title="STARTUPS" class="mb-6 last-item-noborder">
        {this.startups.map((startup, i) => (
          <StartupCard class="_item" startup={startup} key={i} view={this.view} />
        ))}
      </UCard>
    )
  }
})
