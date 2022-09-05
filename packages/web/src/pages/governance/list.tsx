import { UDropdownFilter, UPaginatedList, UPaginatedListPropsType } from '@comunion/components'
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ProposalCard } from './components/ProposalCard'
import { CrowdfundingType, CROWDFUNDING_TYPES } from '@/constants'
import { GOVERNANCE_TYPES } from '@/constants/governance'
import { ServiceReturn, services } from '@/services'

const GovernanceListPage = defineComponent({
  name: 'GovernanceListPage',
  setup() {
    const proposalStatus = ref<string | undefined>(undefined)
    const router = useRouter()
    const total = ref(0)
    const dataService = computed<UPaginatedListPropsType['service']>(
      () => async (page, pageSize) => {
        const { error, data } = await services['crowdfunding@public-crowdfunding-list']({
          limit: pageSize,
          page,
          mode:
            proposalStatus.value !== undefined
              ? CROWDFUNDING_TYPES.indexOf(proposalStatus.value as CrowdfundingType) + 1
              : undefined
        })
        const _total = error ? 0 : data!.totalRows
        total.value = _total
        return { items: error ? [] : data!.rows ?? [], total: _total }
      }
    )
    const toDetail = () => {
      //
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
        <div class="flex mb-8 self-end items-center u-title2 ">
          Filter by:
          <UDropdownFilter
            options={GOVERNANCE_TYPES.map(item => ({ label: item, value: item }))}
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
                  <div class="cursor-pointer mb-6" onClick={() => this.toDetail()}>
                    <ProposalCard key={governance.proposalId} proposalData={governance} />
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
