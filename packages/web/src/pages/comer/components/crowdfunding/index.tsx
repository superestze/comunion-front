import { UCard } from '@comunion/components'
import { defineComponent, reactive, ref, watch } from 'vue'
import { CrowdfundingCard as ItemCard } from '@/pages/crowdfunding/components/CrowdfundingCard'
import { ServiceReturn, services } from '@/services'

type BountyType = NonNullable<ServiceReturn<'crowdfunding@comer-posted-crowdfunding-list'>>

export default defineComponent({
  props: {
    createdByMe: {
      type: Boolean,
      default: () => true
    },
    view: {
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
    const list = ref<BountyType>([])
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
        list.value = data || []
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
      <UCard title="dCROWDFUNDING" class="mb-6">
        {Array.isArray(this.list) &&
          this.list.map(item => <ItemCard info={item} key={item.crowdfundingId} miniCard />)}
      </UCard>
    )
  }
})
