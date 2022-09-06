import { UDrawer, UStartupLogo, UPopover } from '@comunion/components'
import { PlusOutlined, ConfirmOutlined, ArrowRightOutlined } from '@comunion/icons'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import AvatarSelect from '@/components/Profile/AvatarSelect'
import { TeamHoverCard } from '@/pages/startup/detail/components/Teams/TeamHoverCard'
import { services } from '@/services'

const FollowDetail = defineComponent({
  name: 'FollowDetail',
  props: {
    startup: {
      type: Object,
      required: true
    }
  },
  setup(props, ctx) {
    // const selectedAvatar = ref(props.avatar)
    const router = useRouter()

    const startupDate = ref(props.startup)
    const startupDates = startupDate.value?.map(
      (item: {
        comerID: number
        logo: string
        name: string
        location: string
        hashTags: Array<object>
        comerProfile: {
          comerID: number
          avatar: string
          name: string
          location: string
          skills: Array<object>
        }
      }) => {
        item.comerProfile = {
          comerID: item.comerID,
          avatar: item.logo,
          name: item.name,
          location: item.location ?? '',
          skills: item.hashTags
        }
        return item
      }
    )
    const showAvatarModal = ref(false)
    const success = ref(false)
    const funFollow = () => {
      success.value = true
    }
    const plusStatusClick = async (val: { id: number }, e: Event) => {
      e.stopPropagation()
      const { error } = await services['startup@startup-follow']({
        startupId: val.id
      })
      if (!error) {
        startupDates?.forEach((item: { id: number; isDeleted: boolean }) => {
          if (item.id === val.id) {
            item.isDeleted = !item.isDeleted
          }
        })
      }
    }
    const checkedStatusClick = async (val: { id: number }, e: Event) => {
      e.stopPropagation()
      const { error } = await services['startup@startup-unfollow']({
        startupId: val.id
      })
      if (!error) {
        startupDates?.forEach((item: { id: number; isDeleted: boolean }) => {
          if (item.id === val.id) {
            item.isDeleted = !item.isDeleted
          }
        })
      }
    }
    const toStartDetail = (val: number) => {
      router.push({ path: `/startup/${val}` })
    }
    return () => (
      <>
        <div class="rounded-lg cursor-pointer bg-violet-50 h-25 mr-4 w-40" onClick={funFollow}>
          <div class="font-700 mt-4 text-primary ml-4 text-32px u-headline2">
            {startupDates?.length}
          </div>
          <div class="flex mt-4 ml-4 align-center">
            <div class="flex w-full">
              <div class="text-primary  u-body2">Startup</div>
              <div class="flex-1"></div>
              <ArrowRightOutlined class="h-4 mt-1 mr-3 text-primary w-4" />
            </div>
          </div>
        </div>

        <UDrawer title="FOLLOW STARTUP" v-model:show={success.value} width={702}>
          {success.value && (
            <>
              {startupDates.length
                ? startupDates.map(
                    (
                      item: {
                        comerProfile: object
                        logo: string
                        id: number
                        name?: string
                        hashTags?: Array<object>
                        isDeleted?: boolean
                      },
                      index: number
                    ) => {
                      return (
                        <div
                          class="cursor-pointer flex h-28 mb-5 w-full items-center"
                          onClick={() => {
                            toStartDetail(item.id)
                          }}
                          key={index}
                        >
                          <div class="flex h-full border-b-1 w-full pb-5 items-center">
                            <div class="flex content items-center">
                              <div class="h-full mr-5 w-22">
                                <UPopover
                                  placement="left-start"
                                  v-slots={{
                                    trigger: () => (
                                      <UStartupLogo
                                        src={item!.logo}
                                        width="8"
                                        height="8"
                                        class="h-20 w-20"
                                      />
                                    ),
                                    default: () => <TeamHoverCard teamMember={item} />
                                  }}
                                />
                              </div>
                              <div>
                                <div class="mb-2 u-title1 ">{item.name}</div>
                                <div class="divide-x w-80 truncate">
                                  {item.hashTags
                                    ? item?.hashTags.map((tag: { name?: string }, i: number) => {
                                        return i + 1 < 4 ? (
                                          <span
                                            class={[i === 0 ? '' : 'pl-2', 'u-body1 pr-2']}
                                            key={i}
                                          >
                                            {tag.name}
                                          </span>
                                        ) : null
                                      })
                                    : null}
                                </div>
                              </div>
                            </div>
                            <div class="ml-auto mr-1 justify-end">
                              {item.isDeleted && (
                                <div
                                  class="bg-primary border-primary rounded-lg cursor-pointer flex border-1 h-10 text-primary w-30"
                                  onClick={(e: Event) => plusStatusClick(item, e)}
                                >
                                  <div class="flex m-auto align-center">
                                    <PlusOutlined class="h-6 mr-2 text-white w-6 align-center" />
                                    <span class="mt-2px text-white align-center u-title2">
                                      Follow
                                    </span>
                                  </div>
                                </div>
                              )}
                              {!item.isDeleted && (
                                <div
                                  class="border-primary rounded-lg cursor-pointer flex border-1 h-10 text-white w-30"
                                  onClick={(e: Event) => checkedStatusClick(item, e)}
                                >
                                  <div class="flex m-auto align-center">
                                    <ConfirmOutlined class="bg-white h-6 mr-2 text-primary items-center align-center" />
                                    <span class="mt-2px text-primary align-center u-title2">
                                      Unfollow
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    }
                  )
                : null}
            </>
          )}
          <AvatarSelect v-model:show={showAvatarModal.value} />
        </UDrawer>
      </>
    )
  }
})

export default FollowDetail
