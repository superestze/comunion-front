import { UDrawer, UStartupLogo } from '@comunion/components'
import { PlusOutlined, ConfirmOutlined, ArrowRightOutlined } from '@comunion/icons'
import { defineComponent, ref } from 'vue'
import AvatarSelect from '@/components/Profile/AvatarSelect'
import { services } from '@/services'

const FollowDateil = defineComponent({
  name: 'FollowDateil',
  props: {
    startup: {
      type: Array,
      required: true
    }
  },
  setup(props, ctx) {
    // const selectedAvatar = ref(props.avatar)
    console.log(props.startup)
    const startupDate = ref(props.startup)
    const showAvatarModal = ref(false)
    const success = ref(false)
    const funFollow = () => {
      success.value = true
    }

    const plusStatusClick = async (val: any) => {
      const { error } = await services['startup@startup-follow']({
        startupId: val.id
      })
      if (!error) {
        startupDate.value?.forEach((item: any) => {
          if (item.id === val.id) {
            item.isDeleted = !item.isDeleted
          }
        })
      }
    }
    const checkedStatusClick = async (val: any) => {
      const { error } = await services['startup@startup-unfollow']({
        startupId: val.id
      })
      if (!error) {
        startupDate.value?.forEach((item: any) => {
          if (item.id === val.id) {
            item.isDeleted = !item.isDeleted
          }
        })
      }
    }
    return () => (
      <>
        <div class="flex w-full">
          <div class="u-body2  text-primary" onClick={funFollow}>
            Startup
          </div>
          <div class="flex-1"></div>
          <ArrowRightOutlined class="mt-1 mr-3 w-4 h-4 text-primary" onClick={funFollow} />
        </div>
        <UDrawer title="FOLLOW STARTUP" v-model:show={success.value}>
          {success.value && (
            <>
              {startupDate.value.length
                ? startupDate.value.map((item: any, index) => {
                    return (
                      <div class="h-28 w-full flex items-center mb-5" key={index}>
                        <div class="border-b-1 h-full w-full flex items-center pb-5">
                          <div class="content flex items-center">
                            <div class="h-full w-22 mr-5">
                              <UStartupLogo
                                src={item!.logo}
                                width="8"
                                height="8"
                                class="w-20 h-20"
                              />
                            </div>
                            <div>
                              <div class="u-title1 mb-2 ">{item.name}</div>
                              <div class="divide-x">
                                {item.hashTags
                                  ? item?.hashTags.map((tag: any, i: any) => {
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
                                onClick={() => plusStatusClick(item)}
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
                                onClick={() => checkedStatusClick(item)}
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
                  })
                : null}
            </>
          )}
          <AvatarSelect v-model:show={showAvatarModal.value} />
        </UDrawer>
      </>
    )
  }
})

export default FollowDateil
