import { UAddress, UNoContent, UScrollbar } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import dayjs from 'dayjs'
import utcPlugin from 'dayjs/plugin/utc'
import { defineComponent, PropType, computed } from 'vue'
import { allNetworks } from '@/constants'
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
    const financeBasic = computed(() => {
      const findNet = allNetworks.find(network => network.chainId === props.startup?.launchNetwork)
      return [
        {
          name: 'LAUNCH NETWORK:',
          value: findNet ? findNet.name : '--'
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
          value: props.startup?.totalSupply
            ? Number(props.startup?.totalSupply).toLocaleString()
            : '--'
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
          value:
            props.startup?.presaleStart && props.startup?.presaleEnd
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
      ]
    })

    const wallets = computed(() => {
      // return [{ name: 'skkskkskssksksk', value: 'skdflsjflsjdfj' }]
      return props.startup?.wallets
        .filter(wallet => wallet.walletName && wallet.walletAddress)
        .map(item => ({
          name: item.walletName,
          value: item.walletAddress
        }))
    })

    return { financeBasic, wallets }
  },
  render() {
    return (
      <div class="flex flex-wrap gap-6 justify-between">
        <section class="flex-1 mt-30px">
          {this.financeBasic.map(item => {
            return (
              <div class="mb-2 flex flex-wrap items-start">
                <div class="u-label2 text-grey3 whitespace-nowrap w-42 mr-4 flex-0 mb-2">
                  {item.name}
                </div>
                <div class="u-title2 flex-1">{item.value}</div>
              </div>
            )
          })}
        </section>
        <UScrollbar class="flex-1 bg-purple rounded px-6 min-w-90 h-275px">
          <div class="py-30px">
            {(this.wallets || []).length ? (
              (this.wallets || []).map(item => {
                return (
                  <div>
                    <div class="u-label2 mb-2">{item.name}:</div>
                    <UAddress class="text-primary u-title2 mb-4" autoSlice address={item.value} />
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
