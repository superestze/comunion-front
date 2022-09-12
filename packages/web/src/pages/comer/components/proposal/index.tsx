import { UCard, UScrollList } from '@comunion/components'
import { defineComponent, reactive, ref, watch } from 'vue'
import { ProposalCard } from '@/pages/governance/components/ProposalCard'
import { ServiceReturn, services } from '@/services'
import { useUserStore } from '@/stores'
import { IPagination } from '@/types'

export default defineComponent({
  props: {
    createdByMe: {
      type: Boolean,
      default: () => true
    }
  },
  setup(props) {
    const userStore = useUserStore()
    const pagination = reactive<IPagination>({
      pageSize: 10,
      total: 0,
      page: 1,
      loading: false
    })

    const proposalList = ref<
      NonNullable<ServiceReturn<'governance@proposal-list-of-comer-posted'>>['rows']
    >([])

    const getProposalList = async (page: number) => {
      let serviceError = false
      let serviceData: ServiceReturn<'governance@proposal-list-of-comer-posted'>
      if (props.createdByMe) {
        const { error, data } = await services['governance@proposal-list-of-comer-posted']({
          comerID: userStore.profile?.comerID,
          page,
          limit: pagination.pageSize
        })
        serviceError = error
        serviceData = data
      }
      const { error, data } = await services['governance@proposal-list-of-comer-participated']({
        comerID: userStore.profile?.comerID,
        page,
        limit: pagination.pageSize
      })

      serviceError = error
      serviceData = data

      if (!serviceError && serviceData?.rows) {
        proposalList.value = proposalList.value.concat(serviceData.rows)
      }
    }

    watch(
      () => props.createdByMe,
      () => {
        getProposalList(pagination.page)
      },
      {
        immediate: true
      }
    )

    return {
      pagination,
      proposalList,
      getProposalList
    }
  },
  render() {
    console.log('proposal render')

    return (
      <UCard title="PROPPOSAL" class="mb-6">
        <UScrollList
          triggered={this.pagination.loading}
          page={this.pagination.page}
          pageSize={this.pagination.pageSize}
          total={this.pagination.total}
          onLoadMore={() => this.getProposalList(this.pagination.page)}
        >
          {this.proposalList.map(proposal => (
            <div>
              <ProposalCard proposalData={proposal} />
              <div class="h-px w-[90%] bg-grey5 ml-auto"></div>
            </div>
          ))}
        </UScrollList>
      </UCard>
    )
  }
})
