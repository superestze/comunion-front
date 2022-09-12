import { UDropdownFilter, UPaginatedList, UPaginatedListPropsType } from '@comunion/components'
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ProposalCard } from './components/ProposalCard'
import { GOVERNANCE_TYPES } from '@/constants/governance'
import { ServiceReturn, services } from '@/services'

const GovernanceListPage = defineComponent({
  name: 'GovernanceListPage',
  setup() {
    const proposalStatus = ref<number | undefined>(undefined)
    const router = useRouter()
    const total = ref(0)
    const dataService = computed<UPaginatedListPropsType['service']>(
      () => async (page, pageSize) => {
        const { error, data } = await services['governance@public-list']({
          limit: pageSize,
          page,
          states:
            proposalStatus.value !== undefined && proposalStatus.value !== null
              ? [proposalStatus.value + 1]
              : undefined
        })
        const _total = error ? 0 : data!.totalRows
        total.value = _total
        return { items: error ? [] : data!.rows ?? [], total: _total }
      }
    )
    const toDetail = (proposalId: number) => {
      //
      router.push({ path: `/governance/${proposalId}` })
    }
    return {
      dataService,
      proposalStatus,
      toDetail
    }
  },
  render() {
    return (
      <div class="mt-10 mb-16">
        <div class="flex mb-8 justify-end items-center u-title2 ">
          Filter by:
          <UDropdownFilter
            options={GOVERNANCE_TYPES.map((item, index) => ({ label: item, value: index }))}
            placeholder="ALL status"
            class="uppercase rounded border-1 h-10 ml-6 w-37"
            clearable
            v-model:value={this.proposalStatus}
          />
        </div>
        <UPaginatedList
          service={this.dataService}
          children={({
            dataSource: governanceList
          }: {
            dataSource: NonNullable<ServiceReturn<'governance@public-list'>>['rows']
          }) => {
            return (
              <div class="">
                {governanceList.map(governance => (
                  <div
                    class="cursor-pointer mb-6"
                    onClick={() => this.toDetail(governance.proposalId)}
                  >
                    <ProposalCard
                      key={governance.proposalId}
                      proposalData={governance}
                      class="px-10 border"
                    />
                  </div>
                ))}
              </div>
            )
          }}
        />
      </div>
    )
  }
})

export default GovernanceListPage
