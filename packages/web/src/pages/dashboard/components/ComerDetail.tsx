import { UDrawer, UStartupLogo, UPopover } from '@comunion/components'
import { PlusOutlined, ConfirmOutlined, ArrowRightOutlined } from '@comunion/icons'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import AvatarSelect from '@/components/Profile/AvatarSelect'
import { TeamHoverCard } from '@/pages/startup/detail/components/Teams/TeamHoverCard'
import { services } from '@/services'

const ComerDetail = defineComponent({
  name: 'ComerDetail',
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
    const showAvatarModal = ref(false)
    const success = ref(false)
    const funFollow = () => {
      success.value = true
    }

    const plusStatusClick = async (val: { comerID: number; id: number }, e: Event) => {
      e.stopPropagation()
      const { error } = await services['account@comer-follow']({
        comerId: val.comerID
      })
      if (!error) {
        startupDate.value?.forEach((item: { comerProfile: { id: number; isDeleted: boolean } }) => {
          if (item.comerProfile.id === val.id) {
            item.comerProfile.isDeleted = !item.comerProfile.isDeleted
          }
        })
      }
    }
    const checkedStatusClick = async (val: { comerID: number; id: number }, e: Event) => {
      e.stopPropagation()
      const { error } = await services['account@comer-unfollow']({
        comerId: val.comerID
      })
      if (!error) {
        startupDate.value?.forEach((item: { comerProfile: { id: number; isDeleted: boolean } }) => {
          if (item.comerProfile.id === val.id) {
            item.comerProfile.isDeleted = !item.comerProfile.isDeleted
          }
        })
      }
    }
    const toStartDetail = (val: number) => {
      router.push({ path: '/comer', query: { id: val } })
    }
    return () => (
      <>
        <div class="rounded-lg cursor-pointer bg-violet-50 h-25 mr-4 w-40" onClick={funFollow}>
          <div class="font-700 mt-4 text-primary ml-4 text-32px u-headline2">
            {startupDate.value?.length}
          </div>
          <div class="flex mt-4 ml-4 align-center">
            <div class="flex w-full">
              <div class="text-primary  u-body2">Comer</div>
              <div class="flex-1"></div>
              <ArrowRightOutlined class="h-4 mt-1 mr-3 text-primary w-4" />
            </div>
          </div>
        </div>
        <UDrawer title="COMER STARTUP" v-model:show={success.value} width={702}>
          {success.value && (
            <>
              {startupDate.value.length
                ? startupDate.value.map(
                    (
                      item: {
                        comerProfile: {
                          avatar: string
                          id: number
                          comerID: number
                          name?: string
                          skills: Array<object>
                          location: string
                          isDeleted?: boolean
                        }
                      },
                      index: string | number | symbol | undefined
                    ) => {
                      return (
                        <div
                          class="cursor-pointer flex h-28 mb-5 w-full items-center"
                          onClick={() => {
                            toStartDetail(item.comerProfile.comerID)
                          }}
                          key={index}
                        >
                          <div class="flex h-full border-b-1 w-full pb-5 items-center">
                            <div class="flex content items-center">
                              <div class="h-full mr-5 w-22">
                                <UPopover
                                  trigger="click"
                                  placement="top"
                                  v-slots={{
                                    trigger: () => (
                                      <UStartupLogo
                                        src={item.comerProfile!.avatar}
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
                                <div class="mb-2 u-title1 ">{item.comerProfile.name}</div>
                                <div class="divide-x w-80 truncate">
                                  {item.comerProfile.skills
                                    ? item.comerProfile?.skills.map(
                                        (tag: { name?: string }, i: number) => {
                                          return i + 1 < 4 ? (
                                            <span
                                              class={[i === 0 ? '' : 'pl-2', 'u-body1 pr-2']}
                                              key={i}
                                            >
                                              {tag.name}
                                            </span>
                                          ) : null
                                        }
                                      )
                                    : null}
                                </div>
                              </div>
                            </div>
                            <div class="ml-auto mr-1 justify-end">
                              {item.comerProfile.isDeleted && (
                                <div
                                  class="bg-primary border-primary rounded-lg cursor-pointer flex border-1 h-10 text-primary w-30"
                                  onClick={(e: Event) => plusStatusClick(item.comerProfile, e)}
                                >
                                  <div class="flex m-auto align-center">
                                    <PlusOutlined class="h-6 mr-2 text-white w-6 align-center" />
                                    <span class="mt-2px text-white align-center u-title2">
                                      Follow
                                    </span>
                                  </div>
                                </div>
                              )}
                              {!item.comerProfile.isDeleted && (
                                <div
                                  class="border-primary rounded-lg cursor-pointer flex border-1 h-10 text-white w-30"
                                  onClick={(e: Event) => checkedStatusClick(item.comerProfile, e)}
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

export default ComerDetail
