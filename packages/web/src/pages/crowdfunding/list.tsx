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
import CrowdfundingSkeleton from './components/CrowdfundingSkeleton'
import { CrowdfundingType, CROWDFUNDING_TYPES } from '@/constants'
import { ServiceReturn, services } from '@/services'
import { checkSupportNetwork } from '@/utils/wallet'

const CrowdfundingList = defineComponent({
  name: 'CrowdfundingList',
  setup() {
    const startupType = ref<string | undefined>(undefined)
    const inputMember = ref<string>('')
    const total = ref(0)
    const loading = ref(false)
    const defaultPageSize = ref(24)
    const router = useRouter()
    const dataService = computed<UPaginatedListPropsType['service']>(
      () => async (page, pageSize) => {
        loading.value = true
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
        loading.value = false
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
          <div class="flex ml-auto self-end items-center u-body4">
            Filter by:
            <UDropdownFilter
              options={CROWDFUNDING_TYPES.map(item => ({ label: item, value: item }))}
              placeholder="ALL status"
              class="rounded border-1 h-10 ml-6 w-37 uppercase"
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
          defaultPageSize={defaultPageSize.value}
          children={({
            dataSource: crowdfundingList
          }: {
            dataSource: NonNullable<ServiceReturn<'crowdfunding@public-crowdfunding-list'>>['rows']
          }) => {
            return (
              <div class="grid pb-6 gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading.value
                  ? new Array(defaultPageSize.value).fill('').map(item => <CrowdfundingSkeleton />)
                  : crowdfundingList.map(crowdfunding => (
                      <CrowdfundingCard
                        key={crowdfunding.crowdfundingId}
                        info={crowdfunding}
                        onClick={() => toDetail(crowdfunding.crowdfundingId, crowdfunding.chainId)}
                      />
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
