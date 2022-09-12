import { VectorFilled } from '@comunion/icons'
import dayjs from 'dayjs'
import { format } from 'timeago.js'
import { defineComponent, PropType, computed } from 'vue'
import { useBountyContractWrapper } from '../../hooks/useBountyContractWrapper'
import styles from './activity.module.css'
import Bubble from './core'
import { ItemType } from './getItemType'
import { transcationUrl } from '@/constants'
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
  const className = `${styles.normal_message} normal-message bg-purple rounded-8px text-black mt-12px py-16px px-24px overflow-hidden`
  return (
    <div class="flex flex-col flex-grow ml-5">
      <div class="flex justify-between">
        <p class="mb-2 u-title1">{obj.name}</p>
        <div class="flex items-center">
          <p class="text-14px text-grey3 mr-16px">{obj.date}</p>
        </div>
      </div>
      <div class={className} innerHTML={obj.content} />
    </div>
  )
}

function transactionMessage(obj: TransactionMessage) {
  return (
    <div class="flex flex-col flex-grow ml-5">
      <div class="flex justify-between">
        <p class="mb-2 u-title1">{obj.name}</p>
        <div class="flex items-center">
          <p class="text-14px text-grey3 mr-16px">{obj.date}</p>
        </div>
      </div>
      <p class="flex bg-purple rounded-8px text-black mt-12px py-6 px-6 overflow-hidden items-center">
        <div class="flex items-center">
          <div class="flex justify-center items-center rounded-20px w-40px h-40px bg-white">
            <VectorFilled class="text-primary" />
          </div>
          <div class="flex flex-col ml-3 pr-6 border-r-1px border-solid border-grey5 h-16 justify-center">
            <p class="text-16px text-grey1">Send</p>
            <p class="text-14px text-grey3 mt-10px">{obj.dateTime}</p>
          </div>
        </div>
        <div class="flex flex-col ml-6">
          <p class="u-title2 text-grey1">
            {obj.content.token1Amount || 0} {obj.content.token1Symbol}
            {obj.content.token2Symbol && (
              <>
                +{obj.content.token2Amount || 0} {obj.content.token2Symbol}
              </>
            )}
          </p>
          <p class="u-body2 mt-4px">Txn Hash：</p>
          <a
            href={`${obj.url}${obj.content.transactionHash1}`}
            target="_blank"
            class="u-body2 text-primary mt-4px"
          >
            {obj.content.transactionHash1}
          </a>
          {obj.content.transactionHash2 && (
            <a
              href={`${obj.url}${obj.content.transactionHash2}`}
              target="_blank"
              class="u-body2 text-primary mt-4px"
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
          url: transcationUrl[chainId as number],
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
          class="mt-10"
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
