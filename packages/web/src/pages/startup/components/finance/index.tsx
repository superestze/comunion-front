import { UAddress, UCard } from '@comunion/components'
import dayjs from 'dayjs'
import { defineComponent, PropType, computed } from 'vue'
import { allNetworks } from '@/constants'
import { StartupItem } from '@/types'

export default defineComponent({
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
          name: 'Launch Network ：',
          value: findNet ? findNet.name : ''
        },
        {
          name: 'Token Name ：',
          value: props.startup?.tokenName
        },
        {
          name: 'Token Symbol ：',
          value: props.startup?.tokenSymbol
        },
        {
          name: 'Token Supply ：',
          value: props.startup?.totalSupply
            ? Number(props.startup?.totalSupply).toLocaleString()
            : ''
        },
        {
          name: 'Token Concract ：',
          value: props.startup?.tokenContractAddress ? (
            <UAddress autoSlice address={props.startup?.tokenContractAddress} />
          ) : (
            ''
          )
        },
        {
          name: 'Presale ：',
          value:
            props.startup?.presaleStart && props.startup?.presaleEnd
              ? `${dayjs.utc(props.startup?.presaleStart).format('YYYY-MM-DD')} ~ ${dayjs
                  .utc(props.startup?.presaleEnd)
                  .format('YYYY-MM-DD UTC')}`
              : ''
        },
        {
          name: 'Launch ：',
          value: props.startup?.launchDate
            ? dayjs.utc(props.startup?.launchDate).format('YYYY-MM-DD UTC')
            : ''
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
      <UCard title="Finance" class="mb-6">
        <div class="flex flex-col">
          {this.financeBasic.map(item => {
            if (item.value) {
              return (
                <div class="flex mt-4  items-center">
                  <p class="font-primary font-medium tracking-normal max-w-1/2 text-[14px] w-38">
                    {item.name}
                  </p>
                  <p
                    class={`font-primary tracking-normal text-[14px] overflow-hidden text-color3 ${
                      item.name.includes('Token Concract') ? 'text-color2' : ''
                    }`}
                  >
                    {item.value}
                  </p>
                </div>
              )
            }
            return ''
          })}

          <div class="bg-grey5 h-1px mt-6.5 w-full"></div>
          <div class="flex mt-5.5  items-center">
            <p class="font-primary font-medium tracking-normal max-w-1/2 text-[14px] w-38">
              Presale wallet：
            </p>
            <div class="overflow-hidden">
              {(this.wallets || []).map(item => {
                return <UAddress class="font-primary text-color2" autoSlice address={item.value} />
              })}
            </div>
          </div>
        </div>
      </UCard>
    )
  }
})
