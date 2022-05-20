import { UDrawer, UStartupLogo } from '@comunion/components'
import { PlusOutlined, CheckedFilled } from '@comunion/icons'
import { defineComponent, ref, PropType } from 'vue'
import AvatarSelect from '@/components/Profile/AvatarSelect'
import { StartupItem } from '@/types'

const FollowDatel = defineComponent({
  name: 'FollowDatel',
  props: {
    startup: {
      type: Object as PropType<StartupItem>,
      required: true
    }
  },
  setup(props, ctx) {
    // const selectedAvatar = ref(props.avatar)
    const showAvatarModal = ref(false)
    const success = ref(false)
    const plusShow = ref(true)
    const checkedShow = ref(false)
    const funFolow = () => {
      success.value = true
    }
    const styles = {
      combinationStyle: 'pr-2 tracking-normal font-opensans font-400 text-[14px] leading-5'
    }
    const plusStatusClick = () => {
      plusShow.value = false
      checkedShow.value = true
    }
    const checkedStatusClick = () => {
      plusShow.value = true
      checkedShow.value = false
    }
    return () => (
      <>
        <div class="u-body2  text-primary" onClick={funFolow}>
          Startup
        </div>
        <UDrawer title="FOLLOW STARTUP" v-model:show={success.value}>
          {success.value && (
            <>
              <div class="h-28 w-full flex items-center">
                <div class="border-b-1 h-full w-full flex items-center border-gray-5 pb-5">
                  <div class="content flex items-center">
                    <div class="h-full w-22 mr-5">
                      <UStartupLogo
                        src={props.startup!.logo}
                        width="8"
                        height="8"
                        class="w-20 h-20 rounded"
                      />
                    </div>
                    <div>
                      <div class="font-opensans font-700 text-[18px] mb-2 leading-6">
                        {props.startup!.name}
                      </div>
                      <div class="divide-x">
                        {props.startup!.hashTags.map((tag, i) => {
                          return i + 1 < 4 ? (
                            <span class={[i === 0 ? '' : 'pl-2', styles.combinationStyle]}>
                              {tag.name}
                            </span>
                          ) : null
                        })}
                      </div>
                    </div>
                  </div>
                  <div class="justify-end ml-auto mr-1">
                    {plusShow.value && (
                      <div
                        class=" border-1 rounded-lg border-primary text-primary w-30 h-10 flex cursor-pointer"
                        onClick={plusStatusClick}
                      >
                        <div class="m-auto flex align-center">
                          <PlusOutlined class="mr-2 text-primary w-6 h-6 align-center" />
                          <span class="u-title2 align-center text-primary mt-2px">Follow</span>
                        </div>
                      </div>
                    )}
                    {checkedShow.value && (
                      <div
                        class=" border-1 rounded-lg border-primary bg-primary text-white w-30 h-10 flex cursor-pointer"
                        onClick={checkedStatusClick}
                      >
                        <div class="m-auto flex align-center">
                          <CheckedFilled class="mr-2 text-primary w-6 h-6 align-center" />
                          <span class="u-title2 align-center text-white mt-1px">Unfollow</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          <AvatarSelect v-model:show={showAvatarModal.value} />
        </UDrawer>
      </>
    )
  }
})

export default FollowDatel
