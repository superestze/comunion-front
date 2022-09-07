import { UCard, UNoContent } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { defineComponent, ref } from 'vue'
import CrowdfundingMiniCard from './CrowdfundingMiniCard'
import { ServiceReturn, services } from '@/services'

type DataType = NonNullable<ServiceReturn<'crowdfunding@crowdfunding-list-of-startup'>>
export default defineComponent({
  props: {
    startupId: {
      type: String,
      default: () => ''
    }
  },
  setup(props) {
    const list = ref<DataType>([])
    const getBounties = async () => {
      const { error, data } = await services['crowdfunding@crowdfunding-list-of-startup']({
        startupId: props.startupId
      })
      if (!error) {
        list.value = data || []
      }
    }
    getBounties()
    return {
      list,
      getBounties
    }
  },
  render() {
    return (
      <UCard title="DCROWDFUNDING" class="mb-6">
        {Array.isArray(this.list) && this.list.length > 0 ? (
          this.list
            .filter(item => item.status !== 5)
            .map(item => <CrowdfundingMiniCard info={item} key={item.crowdfundingId} />)
        ) : (
          <UNoContent textTip="TO BE EMPTY">
            <EmptyFilled />
          </UNoContent>
        )}
        {/* <UNoContent textTip="TO BE DEV">
          <EmptyFilled />
        </UNoContent> */}
      </UCard>
    )
  }
})
