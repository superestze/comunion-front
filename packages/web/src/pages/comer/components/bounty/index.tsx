import { UCard } from '@comunion/components'
import { defineComponent, reactive, ref, watch } from 'vue'
import BountiesCard from '@/pages/startup/detail/components/Bounties'
import { ServiceReturn, services } from '@/services'

type BountyType = NonNullable<ServiceReturn<'bounty@my-posted-bounty-list'>>['rows']

export default defineComponent({
  props: {
    createdByMe: {
      type: Boolean,
      default: () => true
    },
    userHasStartup: {
      type: Boolean,
      default: false
    },
    view: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props) {
    const pagination = reactive({
      pageSize: 4,
      total: 0,
      page: 1,
      loading: false
    })
    const bounties = ref<BountyType>([])
    const getBounties = async () => {
      const { error, data } = await services[
        props.createdByMe ? 'bounty@my-posted-bounty-list' : 'bounty@my-participated-bounty-list'
      ]({
        page: pagination.page
      })
      if (!error) {
        bounties.value.push(...(data!.rows ?? []))
        pagination.total = data!.totalRows
      }
    }

    const tabChange = () => {
      pagination.total = 0
      pagination.page = 1
      pagination.loading = true
      bounties.value = []
    }

    watch(
      () => props.createdByMe,
      () => {
        tabChange()
        getBounties()
      },
      { immediate: true }
    )

    return {
      pagination,
      bounties,
      getBounties
    }
  },
  render() {
    return (
      <UCard title="BOUNTIES" class="mb-6">
        {this.createdByMe ? (
          <>
            {Array.isArray(this.bounties) &&
              this.bounties.length > 0 &&
              this.bounties.map((bounty, i) => (
                <BountiesCard
                  startup={bounty}
                  key={i}
                  name="dashboard"
                  status={bounty.onChainStatus as string}
                />
              ))}
          </>
        ) : (
          <>
            {Array.isArray(this.bounties) &&
              this.bounties.length > 0 &&
              this.bounties.map((bounty, i) => (
                <BountiesCard
                  startup={bounty}
                  key={i}
                  name="dashboard"
                  status={bounty.onChainStatus as string}
                />
              ))}
          </>
        )}
      </UCard>
    )
  }
})
