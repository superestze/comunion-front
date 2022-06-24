import { UBreadcrumb, UBreadcrumbItem, UCard, UNoContent, USpin } from '@comunion/components'
import { ArrowLeftOutlined, EmptyFilled } from '@comunion/icons'
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ComerInfo } from './components/ComerInfo'
import { StartupInfo } from './components/StartupInfo'
import router from '@/router'
import { ServiceReturn, services } from '@/services'

const ComerDetail = defineComponent({
  name: 'ComerDetail',
  setup() {
    const pageLoading = ref(false)
    const comerInfo = ref<ServiceReturn<'account@comer-info-get'>>()
    const isFollow = ref(false)
    const startupsInfo = ref<ServiceReturn<'startup@startup-list-be-member'>>()
    const route = useRoute()
    const getComerInfo = async () => {
      pageLoading.value = true
      const { error, data } = await services['account@comer-info-get']({
        comerId: route.params.id
      })
      const { error: followError, data: followData } = await services[
        'account@comer-followed-by-me'
      ]({
        comerId: route.params.id
      })
      if (!followError) {
        isFollow.value = followData.isFollowed
      }
      if (!error) {
        comerInfo.value = data
      }
      pageLoading.value = false
    }
    const followComer = async (toStatus: string) => {
      try {
        const { error } = await services[
          toStatus === 'follow' ? 'account@comer-follow' : 'account@comer-unfollow'
        ]({
          comerId: route.params.id
        })
        if (!error) {
          getComerInfo()
        }
      } catch (error) {
        console.log('error', error)
      }
    }
    onMounted(() => {
      getComerInfo()
    })
    return {
      comerId: route.params.id,
      pageLoading,
      comerInfo,
      isFollow,
      startupsInfo,
      followComer
    }
  },
  render() {
    // console.log('this.comerInfo===>', this.comerInfo)

    return (
      <USpin show={this.pageLoading}>
        <UBreadcrumb class="mt-10 mb-10">
          <UBreadcrumbItem v-slots={{ separator: () => <ArrowLeftOutlined /> }} />
          <UBreadcrumbItem v-slots={{ separator: () => <ArrowLeftOutlined /> }}>
            <span
              class="cursor-pointer text-primary uppercase u-label2"
              onClick={() => {
                router.back()
              }}
            >
              STARTUP DETAIL
            </span>
          </UBreadcrumbItem>
          <UBreadcrumbItem v-slots={{ separator: () => <ArrowLeftOutlined /> }}>
            <span class="cursor-pointer text-primary uppercase u-label2">Comer Detail</span>
          </UBreadcrumbItem>
        </UBreadcrumb>
        <div class="flex gap-6 mb-20">
          <section class="basis-[420px]">
            <ComerInfo
              profileInfo={this.comerInfo?.comerProfile}
              isFollow={this.isFollow}
              address={this.comerInfo?.address}
              followList={this.comerInfo?.follows}
              fansList={this.comerInfo?.followed}
              fansCount={this.comerInfo?.followedCount}
              followCount={this.comerInfo?.followsCount}
              onFollowComer={this.followComer}
            />
          </section>
          <section class="flex-1">
            <UCard title="Startup" class="mb-6 !pb-8">
              <StartupInfo comerId={this.comerId as string} />
            </UCard>
            <UCard title="Bounty" class="!pb-8">
              <UNoContent textTip="TO BE DEVELOPED" class="py-20">
                <EmptyFilled />
              </UNoContent>
            </UCard>
          </section>
        </div>
      </USpin>
    )
  }
})

export default ComerDetail
