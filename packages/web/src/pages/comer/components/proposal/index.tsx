import { UCard } from '@comunion/components'
import { defineComponent, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
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
    const router = useRouter()
    const userStore = useUserStore()
    const pagination = reactive<IPagination>({
      pageSize: 5,
      total: 0,
      page: 1,
      loading: false
    })

    const proposalList = ref<
      NonNullable<ServiceReturn<'governance@proposal-list-of-comer-posted'>>['rows']
    >([])

    const getProposalList = async (page: number) => {
      // let serviceError = false
      // let serviceData: ServiceReturn<'governance@proposal-list-of-comer-posted'>
      try {
        pagination.page = page
        pagination.loading = true
        const { error, data } = await services[
          props.createdByMe
            ? 'governance@proposal-list-of-comer-posted'
            : 'governance@proposal-list-of-comer-participated'
        ]({
          comerID: userStore.profile?.comerID,
          page,
          limit: pagination.pageSize
        })

        if (!error && data?.rows) {
          pagination.total = data.totalRows
          proposalList.value = proposalList.value.concat(data.rows)
        }
        pagination.loading = false
      } catch (error) {
        pagination.loading = false
      }
    }

    const toProposalDetail = async (proposalId: number) => {
      router.push({ path: `/governance/${proposalId}` })
    }

    watch(
      () => props.createdByMe,
      () => {
        pagination.page = 1
        pagination.total = 0
        proposalList.value = []
        getProposalList(pagination.page)
      },
      {
        immediate: true
      }
    )

    return {
      pagination,
      proposalList,
      getProposalList,
      toProposalDetail
    }
  },
  render() {
    return (
      <UCard title="Proposal" class="mb-6">
        {this.proposalList.map(proposal => (
          <div class="cursor-pointer" onClick={() => this.toProposalDetail(proposal.proposalId)}>
            <ProposalCard proposalData={proposal} />
          </div>
        ))}
      </UCard>
    )
  }
})
