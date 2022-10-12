import { UCard } from '@comunion/components'
import { defineComponent, reactive, ref, watch } from 'vue'
import { default as ItemCard } from '@/pages/crowdfunding/components/CrowdfundingMiniCard'
import { services } from '@/services'
import { CrowdfundingItem } from '@/types'

export default defineComponent({
  props: {
    createdByMe: {
      type: Boolean,
      default: () => true
    },
    viewMode: {
      type: Boolean,
      default: () => false
    },
    comerId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const pagination = reactive({
      pageSize: 999,
      total: 0,
      page: 1,
      loading: false
    })
    const list = ref<CrowdfundingItem[]>([])
    const getBounties = async () => {
      const { error, data } = await services[
        props.createdByMe
          ? 'crowdfunding@comer-posted-crowdfunding-list'
          : 'crowdfunding@comer-participated-crowdfunding-list'
      ]({
        limit: pagination.pageSize,
        page: pagination.page,
        comerID: props.comerId
      })
      if (!error) {
        const dataList: CrowdfundingItem[] = Array.isArray(data)
          ? data.map(item => {
              return {
                ...item,
                kyc: item.kyc || '',
                contractAudit: item.contractAudit || '',
                buyTokenAmount: item.buyTokenAmount || 0
              }
            })
          : []
        list.value = dataList
      }
    }

    const tabChange = () => {
      pagination.total = 0
      pagination.page = 1
      pagination.loading = true
      list.value = []
    }

    watch(
      () => props.createdByMe,
      () => {
        tabChange()
        getBounties()
      },
      { immediate: true }
    )

    return {
      pagination,
      list,
      getBounties
    }
  },
  render() {
    return (
      <UCard title="dCrowdfunding" class="mb-6">
        {Array.isArray(this.list) &&
          this.list.map(item => <ItemCard class="-mx-4" info={item} key={item.crowdfundingId} />)}
      </UCard>
    )
  }
})
