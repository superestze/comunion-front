import { UButton, UPopover, UStartupLogo, UTag } from '@comunion/components'
import { HookFilled, PlusOutlined } from '@comunion/icons'
import { defineComponent, computed, ref, watch, PropType } from 'vue'

import { useStartupProfile } from '../../hooks/useStartupProfile'
import defaultCover from './assets/cover.png'
import SocialIcon from '@/components/SocialIcon'
import { getStartupTypeFromNumber, StartupTypesType, STARTUP_TYPES_COLOR_MAP } from '@/constants'
import { getContactList } from '@/pages/startup/setting/[id]'
import { contactList } from '@/pages/startup/setting/components/social/util'
import { StartupDetail } from '@/types'

export default defineComponent({
  props: {
    startupId: {
      type: String,
      required: true
    },
    startup: {
      type: Object as PropType<StartupDetail>,
      required: true
    }
  },
  setup(props) {
    const modeName = computed(() => {
      return getStartupTypeFromNumber(props.startup.mode) as StartupTypesType
    })
    const userIsFollow = ref<boolean>(false)
    const loading = ref<boolean>(false)
    const profile = useStartupProfile()
    const { toggleFollowStartup, getUserIsFollow } = profile

    getUserIsFollow(props.startupId)
      .then(() => (userIsFollow.value = true))
      .catch(() => (userIsFollow.value = false))

    const startupInfo = ref<StartupDetail>()

    watch(
      () => props.startup,
      () => {
        startupInfo.value = props.startup
      },
      {
        immediate: true
      }
    )
    // TODO
    // contactList
    console.log(contactList)
    const socialList = computed(() => {
      return (startupInfo.value ? getContactList(startupInfo.value) : []).map(item => {
        const targetIndex = contactList.findIndex(type => type.value === item.socialType)
        return {
          ...item,
          label: targetIndex === -1 ? '' : contactList[targetIndex].label
        }
      })
    })

    return {
      modeName,
      toggleFollowStartup,
      userIsFollow,
      loading,
      startupInfo,
      socialList
    }
  },
  render() {
    const handleFollowStartup = (type: string) => {
      this.loading = true
      this.toggleFollowStartup(type, this.startupId)
        .then(() => {
          this.userIsFollow = !this.userIsFollow
        })
        .finally(() => (this.loading = false))
    }
    return (
      <div class="bg-white border rounded-lg mb-6  overflow-hidden">
        <div class="h-13.125rem overflow-hidden">
          <img
            src={this.startupInfo?.cover || defaultCover}
            alt="bg"
            class="h-full object-cover w-full"
          />
        </div>

        <div class="flex mt-4 justify-between relative">
          <div
            class="rounded-8px h-30 bottom-2 left-10 w-30 absolute overflow-hidden"
            style="box-shadow: 2px 6px 12px rgba(69, 68, 132, 0.25);"
          >
            <UStartupLogo
              src={''}
              width="30"
              height="30"
              class="bg-white rounded-md !object-contain"
            />
          </div>
          <div class="flex items-center">
            <p class="ml-46 u-h2">{this.startupInfo?.name}</p>
            {this.startupInfo && this.startupInfo.mode > 0 && (
              <UTag
                class="h-5 ml-5 u-tag2"
                type="filled"
                bgColor={STARTUP_TYPES_COLOR_MAP[this.modeName]}
              >
                {this.modeName}
              </UTag>
            )}
          </div>
          {this.userIsFollow ? (
            <UButton
              type="primary"
              loading={this.loading}
              ghost
              class="mr-10 w-30"
              size="small"
              onClick={() => handleFollowStartup('unfollow')}
            >
              <HookFilled class="mr-1 w-4.5" />
              Unconnect
            </UButton>
          ) : (
            <UButton
              type="primary"
              loading={this.loading}
              class="mr-10 w-30"
              size="small"
              onClick={() => handleFollowStartup('follow')}
            >
              <PlusOutlined class="mt-1 mb-3px w-4.5" />
              Connect
            </UButton>
          )}
        </div>
        <div class="flex mt-9 mr-10 mb-10 ml-10 justify-between">
          <div class="flex flex-col">
            <div class="flex gap-2">
              {Array.isArray(this.startupInfo?.hashTags) &&
                this.startupInfo?.hashTags.map((item: { name: string }, i: number) => {
                  return (
                    <UTag key={i} class="!border-1 !border-[#3F2D99] !text-[#3F2D99]">
                      {item.name}
                    </UTag>
                  )
                })}
            </div>
            <p class="mt-5 mb-10 w-180 u-body2">{this.startupInfo?.mission}</p>
            <div class="flex flex-wrap gap-4">
              {this.socialList.map(item => (
                <UPopover
                  placement="bottom"
                  v-slots={{
                    trigger: () => (
                      <a href={item.socialLink} target="_blank">
                        <SocialIcon icon={item.label} outWrapper="w-10 h-10" />
                      </a>
                    ),
                    default: () => <div class="cursor-pointer flex m-3">{item.label}</div>
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
})
