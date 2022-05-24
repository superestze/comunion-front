import { UAddress, UNoContent, UScrollbar } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { formatNumber } from '@comunion/utils'
import dayjs from 'dayjs'
import utcPlugin from 'dayjs/plugin/utc'
import { defineComponent, PropType, ref, computed } from 'vue'
import { StartupItem } from '@/types'
dayjs.extend(utcPlugin)

export const Finance = defineComponent({
  name: 'StartupFinance',
  props: {
    startup: {
      type: Object as PropType<StartupItem>
    }
  },
  setup(props) {
    const financeBasic = ref([
      {
        name: 'LAUNCH NETWORK:',
        value: props.startup?.launchNetwork || '--'
      },
      {
        name: 'TOKEN NAME:',
        value: props.startup?.tokenName || '--'
      },
      {
        name: 'TOKEN SYMBOL:',
        value: props.startup?.tokenSymbol || '--'
      },
      {
        name: 'TOKEN SUPPLY:',
        value: props.startup?.totalSupply ? formatNumber(props.startup?.totalSupply) : '--'
      },
      {
        name: 'TOKEN CONTRACT:',
        value: props.startup?.tokenContractAddress ? (
          <UAddress autoSlice address={props.startup?.tokenContractAddress} />
        ) : (
          '--'
        )
      },
      {
        name: 'PRESALE:',
        value: props.startup?.presaleStart
          ? `${dayjs.utc(props.startup?.presaleStart).format('YYYY-MM-DD')} ~ ${dayjs
              .utc(props.startup?.presaleEnd)
              .format('YYYY-MM-DD UTC')}`
          : '--'
      },
      {
        name: 'LAUNCH:',
        value: props.startup?.launchDate
          ? dayjs.utc(props.startup?.launchDate).format('YYYY-MM-DD UTC')
          : '--'
      }
    ])

    const wallets = computed(() => {
      // return [{ name: 'skkskkskssksksk', value: 'skdflsjflsjdfj' }]
      return props.startup?.wallets.map(item => ({
        name: item.walletName,
        value: item.walletAddress
      }))
    })

    return { financeBasic, wallets }
  },
  render() {
    return (
      <div class="max-h-115 h-full overflow-hidden flex gap-6 justify-between items-stretch">
        <section class="mt-10">
          {this.financeBasic.map(item => {
            return (
              <div class="mb-2 flex flex-wrap">
                <div class="u-label2 text-grey3 whitespace-nowrap w-42 mr-4 flex-0 mb-2">
                  {item.name}
                </div>
                <div class="u-title2 flex-auto">{item.value}</div>
              </div>
            )
          })}
        </section>
        <UScrollbar class="bg-purple rounded px-6 max-h-115 basis-2/5 min-w-90">
          <div class="py-10">
            {(this.wallets || []).length ? (
              (this.wallets || []).map(item => {
                return (
                  <div>
                    <div class="u-label2">{item.name}:</div>
                    <UAddress class="text-primary u-title2" autoSlice address={item.value} />
                  </div>
                )
              })
            ) : (
              <UNoContent textTip="NO WALLET ADDRESS">
                <EmptyFilled />
              </UNoContent>
            )}
          </div>
        </UScrollbar>
      </div>
    )
  }
})
