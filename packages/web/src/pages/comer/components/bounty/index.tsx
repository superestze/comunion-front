import { UCard } from '@comunion/components'
import { defineComponent, reactive, ref, watch } from 'vue'
import BountyCard from '@/pages/bounty/components/BountyCard'
import { ServiceReturn, services } from '@/services'

type BountyType = NonNullable<ServiceReturn<'bounty@my-posted-bounty-list'>>['rows']

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
    const bounties = ref<BountyType>([])
    const getBounties = async () => {
      const { error, data } = await services[
        props.createdByMe
          ? 'bounty@comer-posted-bounty-list'
          : 'bounty@comer-participated-bounty-list'
      ]({
        limit: pagination.pageSize,
        page: pagination.page,
        comerID: props.comerId
      })
      if (!error) {
        bounties.value.push(...(data!.rows ?? []))
        pagination.total = data!.totalRows
      }
    }

    const tabChange = () => {
      pagination.total = 0
      pagination.page = 1
      pagination.loading = true
      bounties.value = []
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
      bounties,
      getBounties
    }
  },
  render() {
    return (
      <UCard title="Bounty" class="mb-6">
        {Array.isArray(this.bounties) &&
          this.bounties.map((bounty, i) => (
            <BountyCard class="-mx-4" info={bounty} key={i} miniCard />
          ))}
      </UCard>
    )
  }
})
