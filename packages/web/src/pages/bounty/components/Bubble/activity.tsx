import { VectorFilled } from '@comunion/icons'
import dayjs from 'dayjs'
import { format } from 'timeago.js'
import { defineComponent, PropType, computed } from 'vue'
import { useBountyContractWrapper } from '../../hooks/useBountyContractWrapper'
import Bubble from './core'
import { ItemType } from './getItemType'
import { TRANSCATION_URL } from '@/constants'
import { ServiceReturn } from '@/services'

type NormalMessage = {
  name: string
  date: string
  content: string
}

type TransactionMessage = {
  name: string
  date: string
  dateTime: string
  url: string
  content: TransactionContent
}

type TransactionContent = {
  token1Symbol: string
  token2Symbol: string
  token1Amount: number
  token2Amount: number
  transactionHash1: string
  transactionHash2: string
}

function normalMessage(obj: NormalMessage) {
  return (
    <div class="flex-1 ml-4">
      <div class="mb-4 items-center">
        <p class="font-primary font-semibold mb-1 text-4">{obj.name}</p>
        <p class="font-primary mr-16px text-14px text-color3">{obj.date}</p>
      </div>
      <div class={`bg-purple rounded-md  mt-3 py-4 px-6 `}>
        <div class={` text-black u-body2 max-h-20 overflow-auto`} innerHTML={obj.content}></div>
      </div>
    </div>
  )
}

function transactionMessage(obj: TransactionMessage) {
  return (
    <div class="flex-1 ml-4">
      <div class="mb-4 items-center">
        <p class="font-primary font-semibold mb-1 text-4">{obj.name}</p>
        <p class="font-primary mr-16px text-14px text-color3">{obj.date}</p>
      </div>
      <p class="bg-purple flex rounded-8px text-black p-6 overflow-hidden items-center">
        <div class="flex items-center">
          <div class="bg-white flex rounded-20px h-40px w-40px justify-center items-center">
            <VectorFilled class="text-primary" />
          </div>
          <div class="border-solid border-color-border flex flex-col border-r-1px h-16 ml-3 pr-6 justify-center">
            <p class="font-primary font-semibold text-16px text-[##333333]">Send</p>
            <p class="mt-10px text-14px text-grey3">{obj.dateTime}</p>
          </div>
        </div>
        <div class="flex flex-col ml-6">
          <p class="text-color1 u-title2">
            {obj.content.token1Amount || 0} {obj.content.token1Symbol}
            {obj.content.token2Symbol && (
              <>
                +{obj.content.token2Amount || 0} {obj.content.token2Symbol}
              </>
            )}
          </p>
          <p class="font-primary font-400 mt-4px">Txn Hash：</p>
          <a
            href={`${obj.url}${obj.content.transactionHash1}`}
            target="_blank"
            class="font-primary font-400 mt-4px text-primary"
          >
            {obj.content.transactionHash1}
          </a>
          {obj.content.transactionHash2 && (
            <a
              href={`${obj.url}${obj.content.transactionHash2}`}
              target="_blank"
              class="font-primary font-400 mt-4px text-primary"
            >
              {obj.content.transactionHash2}
            </a>
          )}
        </div>
      </p>
    </div>
  )
}

export default defineComponent({
  name: 'ActivityBubble',
  props: {
    activity: {
      type: Array as PropType<ItemType<ServiceReturn<'bounty@bounty-activities-list'>>>,
      required: true
    }
  },
  setup(props) {
    const { chainId } = useBountyContractWrapper()
    const fn = computed(() => {
      if (props.activity?.sourceType === 1) {
        const obj: NormalMessage = {
          name: props.activity?.name || '',
          date: format(props.activity?.timestamp || '', 'comunionTimeAgo'),
          content: props.activity?.content || ''
        }
        return () => <>{normalMessage(obj)}</>
      } else if (props.activity?.sourceType === 2) {
        const obj: TransactionMessage = {
          name: props.activity?.name || '',
          date: format(props.activity?.timestamp || '', 'comunionTimeAgo'),
          dateTime: dayjs(props.activity?.timestamp || '').format('MMM D'),
          url: TRANSCATION_URL[chainId as number],
          content: JSON.parse(props.activity?.content as string) as TransactionContent
        }
        return () => <>{transactionMessage(obj)}</>
      }
      return () => <span>error sourceType ${props.activity?.sourceType}</span>
    })
    return { fn }
  },
  render() {
    return (
      <>
        <Bubble
          class="mb-10"
          avatar={this.activity?.avatar || ''}
          comerId={this.activity?.comerID as unknown as string}
          v-slots={{
            default: this.fn
          }}
        />
      </>
    )
  }
})
