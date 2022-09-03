import { UButton, UPopover, UStartupLogo, UTag } from '@comunion/components'
import { HookFilled, PlusOutlined } from '@comunion/icons'
import { defineComponent, computed, ref } from 'vue'

import { useStartupProfile } from '../../hooks/useStartupProfile'
import test from './test.png'
import SocialIcon from '@/components/SocialIcon'
import {
  getStartupTypeFromNumber,
  SocialTypeList,
  StartupTypesType,
  STARTUP_TYPES_COLOR_MAP
} from '@/constants'

export default defineComponent({
  props: {
    startupId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    mode: {
      type: Number,
      required: true
    },
    mission: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const modeName = computed(() => {
      return getStartupTypeFromNumber(props.mode) as StartupTypesType
    })
    const userIsFollow = ref<boolean>(false)
    const loading = ref<boolean>(false)
    const profile = useStartupProfile()
    const { toggleFollowStartup, getUserIsFollow } = profile
    getUserIsFollow(props.startupId)
      .then(() => (userIsFollow.value = true))
      .catch(() => (userIsFollow.value = false))
    return {
      modeName,
      toggleFollowStartup,
      userIsFollow,
      loading
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
          <img src={test} alt="bg" class="h-full object-cover w-full" />
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
            <p class="ml-46 u-h1">{this.name}</p>
            {this.mode > 0 && (
              <UTag
                class="h-5 ml-5 !u-body3-pure"
                type="filled"
                bgColor={STARTUP_TYPES_COLOR_MAP[this.modeName]}
              >
                {this.modeName}
              </UTag>
            )}
            <div class="bg-[#EC53A4] rounded-2px text-white py-1 px-2.5">
              <a href="https://google.com" target="_blank">
                KYC
              </a>
            </div>
            <div class="bg-primary rounded-2px text-white py-1 px-2.5">
              <a>AUDIT</a>
            </div>
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
              <p class="border flex border-primary1 rounded-2px h-6 py-1 px-2 text-primary1 text-12px overflow-hidden items-center justify-center">
                123123
              </p>
            </div>
            <p class="mt-5 w-180 u-body2 ">{this.mission}</p>
          </div>
          <div class="flex flex-wrap gap-4 items-end">
            {SocialTypeList.map(item => (
              <UPopover
                placement="top"
                v-slots={{
                  trigger: () => <SocialIcon icon={item.value} outWrapper="w-10 h-10" />,
                  default: () => <div class="cursor-pointer flex m-3">{item.value}</div>
                }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
})
