import { UNoContent } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
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
        value: ''
      },
      {
        name: 'TOKEN NAME:',
        value: ''
      },
      {
        name: 'TOKEN SYMBOL:',
        value: ''
      },
      {
        name: 'TOKEN SUPPLY:',
        value: ''
      },
      {
        name: 'TOKEN CONTRACT:',
        value: props.startup?.tokenContractAddress
      },
      {
        name: 'PRESALE:',
        value: props.startup?.presaleDate
      },
      {
        name: 'LAUNCH:',
        value: props.startup?.launchDate
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
              <div class="mb-4">
                <span class="u-label2 text-grey3 min-w-1/3">{item.name}</span>
                <span class="u-title2">{item.value}</span>
              </div>
            )
          })}
        </section>
        <section class="bg-purple rounded py-10 px-6">
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
            <UNoContent class="px-26" textTip="NO WALLET ADDRESS">
              <EmptyFilled />
            </UNoContent>
          )}
        </section>
      </div>
    )
  }
})
