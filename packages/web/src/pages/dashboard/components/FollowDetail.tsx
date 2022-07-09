import { UDrawer, UStartupLogo, UPopover } from '@comunion/components'
import { PlusOutlined, ConfirmOutlined, ArrowRightOutlined } from '@comunion/icons'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { TeamHoverCard } from '../../startup/detail/components/Teams/TeamHoverCard'
import AvatarSelect from '@/components/Profile/AvatarSelect'
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
      router.push({ path: '/startup/detail', query: { startupId: val } })
    }
    return () => (
      <>
        <div class="w-40 h-25 rounded-lg bg-violet-50 mr-4 cursor-pointer" onClick={funFollow}>
          <div class="u-headline2 text-32px font-700 text-primary mt-4 ml-4">
            {startupDates?.length}
          </div>
          <div class="flex align-center ml-4 mt-4">
            <div class="flex w-full">
              <div class="u-body2  text-primary">Startup</div>
              <div class="flex-1"></div>
              <ArrowRightOutlined class="mt-1 mr-3 w-4 h-4 text-primary" />
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
                          class="h-28 w-full flex items-center mb-5 cursor-pointer"
                          onClick={() => {
                            toStartDetail(item.id)
                          }}
                          key={index}
                        >
                          <div class="border-b-1 h-full w-full flex items-center pb-5">
                            <div class="content flex items-center">
                              <div class="h-full w-22 mr-5">
                                <UPopover
                                  placement="left-start"
                                  v-slots={{
                                    trigger: () => (
                                      <UStartupLogo
                                        src={item!.logo}
                                        width="8"
                                        height="8"
                                        class="w-20 h-20"
                                      />
                                    ),
                                    default: () => <TeamHoverCard teamMember={item} />
                                  }}
                                />
                              </div>
                              <div>
                                <div class="u-title1 mb-2 ">{item.name}</div>
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
                            <div class="justify-end ml-auto mr-1">
                              {item.isDeleted && (
                                <div
                                  class="border-1 rounded-lg border-primary bg-primary text-primary w-30 h-10 flex cursor-pointer"
                                  onClick={(e: Event) => plusStatusClick(item, e)}
                                >
                                  <div class="m-auto flex align-center">
                                    <PlusOutlined class="mr-2 text-white w-6 h-6 align-center" />
                                    <span class="u-title2 align-center text-white mt-2px">
                                      Follow
                                    </span>
                                  </div>
                                </div>
                              )}
                              {!item.isDeleted && (
                                <div
                                  class="border-1 rounded-lg border-primary text-white w-30 h-10 flex cursor-pointer"
                                  onClick={(e: Event) => checkedStatusClick(item, e)}
                                >
                                  <div class="m-auto flex align-center">
                                    <ConfirmOutlined class="mr-2 text-primary bg-white h-6 items-center align-center" />
                                    <span class="u-title2 align-center text-primary mt-2px">
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