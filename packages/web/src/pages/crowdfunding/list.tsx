import {
  UDropdownFilter,
  UPaginatedList,
  UPaginatedListPropsType,
  UInputGroup,
  USearch
} from '@comunion/components'
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { CrowdfundingCard } from './components/CrowdfundingCard'
import { CrowdfundingType, CROWDFUNDING_TYPES } from '@/constants'
import { ServiceReturn, services } from '@/services'
import { checkSupportNetwork } from '@/utils/wallet'

const CrowdfundingList = defineComponent({
  name: 'CrowdfundingList',
  setup() {
    const startupType = ref<string | undefined>(undefined)
    const inputMember = ref<string>('')
    const total = ref(0)
    const router = useRouter()
    const dataService = computed<UPaginatedListPropsType['service']>(
      () => async (page, pageSize) => {
        const { error, data } = await services['crowdfunding@public-crowdfunding-list']({
          limit: pageSize,
          page,
          mode:
            startupType.value !== undefined
              ? CROWDFUNDING_TYPES.indexOf(startupType.value as CrowdfundingType) + 1
              : undefined,
          keyword: inputMember.value
        })
        const _total = error ? 0 : data!.totalRows
        total.value = _total
        return { items: error ? [] : data!.rows ?? [], total: _total }
      }
    )

    const toDetail = async (crowdfundingId: number, chainId: number) => {
      const isSupport = await checkSupportNetwork(chainId)
      if (isSupport) {
        router.push('/crowdfunding/' + crowdfundingId)
      }
    }

    return () => (
      <div class="mt-10 mb-16">
        <div class="flex mb-8">
          {/* <h3 class="text-grey1 u-h3">{total.value.toLocaleString()} Available</h3> */}
          <div class="flex ml-auto self-end items-center u-title2 ">
            Filter by:
            <UDropdownFilter
              options={CROWDFUNDING_TYPES.map(item => ({ label: item, value: item }))}
              placeholder="ALL status"
              class="uppercase rounded border-1 h-10 ml-6 w-37"
              clearable
              v-model:value={startupType.value}
            />
            <UInputGroup class="h-10 ml-6 w-37 ">
              <USearch
                v-model:value={inputMember.value}
                placeholder="Search"
                class="bg-transparent -my-0\.5 "
              />
            </UInputGroup>
          </div>
        </div>
        <UPaginatedList
          service={dataService.value}
          children={({
            dataSource: crowdfundingList
          }: {
            dataSource: NonNullable<ServiceReturn<'crowdfunding@public-crowdfunding-list'>>['rows']
          }) => {
            return (
              <div class="grid pb-6 gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {crowdfundingList.map(crowdfunding => (
                  <div
                    class="cursor-pointer"
                    onClick={() => toDetail(crowdfunding.crowdfundingId, crowdfunding.chainId)}
                  >
                    <CrowdfundingCard key={crowdfunding.crowdfundingId} info={crowdfunding} />
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

export default CrowdfundingList
