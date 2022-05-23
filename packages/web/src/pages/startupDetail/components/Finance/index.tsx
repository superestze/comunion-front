import { UAddress, UNoContent } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import dayjs from 'dayjs'
import { defineComponent, PropType, ref, computed } from 'vue'
import { StartupItem } from '@/types'

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
        value: props.startup?.launchNetwork
      },
      {
        name: 'TOKEN NAME:',
        value: props.startup?.tokenName
      },
      {
        name: 'TOKEN SYMBOL:',
        value: props.startup?.tokenSymbol
      },
      {
        name: 'TOKEN SUPPLY:',
        value: props.startup?.totalSupply
      },
      {
        name: 'TOKEN CONTRACT:',
        value: props.startup?.tokenContractAddress ? (
          <UAddress autoSlice address={props.startup?.tokenContractAddress} />
        ) : (
          ''
        )
      },
      {
        name: 'PRESALE:',
        value: props.startup?.presaleStart
          ? `${dayjs.utc(props.startup?.presaleStart).format('YYYY-MM-DD')} ~ ${dayjs
              .utc(props.startup?.presaleEnd)
              .format('YYYY-MM-DD UTC')}`
          : null
      },
      {
        name: 'LAUNCH:',
        value: props.startup?.launchDate
          ? dayjs.utc(props.startup?.launchDate).format('YYYY-MM-DD UTC')
          : null
      }
    ])

    const wallets = computed(() => {
      return props.startup?.wallets.map(item => ({
        name: item.walletName,
        value: item.walletAddress
      }))
    })

    return { financeBasic, wallets }
  },
  render() {
    return (
      <div class="flex justify-between">
        <section class="mt-10">
          {this.financeBasic.map(item => {
            return (
              <div class="mb-4 flex">
                <div class="u-label2 text-grey3 whitespace-nowrap basis-42 mr-4">{item.name}</div>
                <div class="u-title2">{item.value}</div>
              </div>
            )
          })}
        </section>
        <section class="bg-purple rounded py-10 px-6 max-w-95 w-full">
          {(this.wallets || []).length ? (
            (this.wallets || []).map(item => {
              return (
                <div>
                  <div>{item.name}</div>
                  <div>{item.value}</div>
                </div>
              )
            })
          ) : (
            <UNoContent textTip="NO WALLET ADDRESS">
              <EmptyFilled />
            </UNoContent>
          )}
        </section>
      </div>
    )
  }
})
