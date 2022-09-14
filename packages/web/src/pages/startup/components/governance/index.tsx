import { UCard, UScrollList } from '@comunion/components'
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ProposalCard } from '@/pages/governance/components/ProposalCard'
import { ServiceReturn, services } from '@/services'
import { IPagination } from '@/types'

export default defineComponent({
  name: 'governance',
  props: {
    startupId: {
      type: String,
      default: () => ''
    }
  },
  setup(props) {
    const router = useRouter()
    const pagination = reactive<IPagination>({
      pageSize: 5,
      total: 0,
      page: 1,
      loading: false
    })

    const proposalList = ref<
      NonNullable<ServiceReturn<'governance@proposal-list-by-startup'>>['rows']
    >([])

    const getProposalList = async (page: number) => {
      // let serviceError = false
      // let serviceData: ServiceReturn<'governance@proposal-list-by-startup'>

      const { error, data } = await services['governance@proposal-list-by-startup']({
        startupId: props.startupId,
        page,
        limit: pagination.pageSize
      })

      if (!error && data?.rows) {
        proposalList.value = proposalList.value.concat(data.rows)
      }
    }

    const toProposalDetail = async (proposalId: number) => {
      router.push({ path: `/governance/${proposalId}` })
    }

    onMounted(() => {
      getProposalList(pagination.page)
    })

    // watch(
    //   () => props.createdByMe,
    //   () => {
    //     pagination.page = 1
    //     pagination.total = 0
    //     proposalList.value = []
    //     getProposalList(pagination.page)
    //   },
    //   {
    //     immediate: true
    //   }
    // )

    return {
      pagination,
      proposalList,
      getProposalList,
      toProposalDetail
    }
  },
  render() {
    console.log('proposal render')

    return (
      <UCard title="PROPOSAL" class="mb-6">
        <UScrollList
          triggered={this.pagination.loading}
          page={this.pagination.page}
          pageSize={this.pagination.pageSize}
          total={this.pagination.total}
          onLoadMore={() => this.getProposalList(this.pagination.page)}
        >
          {this.proposalList.map(proposal => (
            <div>
              <div
                class="cursor-pointer"
                onClick={() => this.toProposalDetail(proposal.proposalId)}
              >
                <ProposalCard proposalData={proposal} />
              </div>
              <div class="h-px w-[90%] bg-grey5 ml-auto"></div>
            </div>
          ))}
        </UScrollList>
      </UCard>
    )
  }
})
