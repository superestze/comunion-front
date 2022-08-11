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
      <div class="bg-white rounded-lg border mb-6 relative overflow-hidden">
        <div class="h-75">
          <img src={test} alt="bg" />
        </div>
        <div class="absolute w-30 h-30 rounded-8px left-10 top-60">
          <UStartupLogo src={''} width="30" height="30" class="rounded !object-contain" />
        </div>
        <div class="flex justify-between mt-6">
          <div class="flex items-center">
            <p class="ml-46 text-32px font-bold">{this.name}</p>
            {this.mode > 0 && (
              <UTag
                class="ml-5 !u-body3-pure"
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
              class="w-30 mr-10"
              size="small"
              onClick={() => handleFollowStartup('unfollow')}
            >
              <HookFilled class="w-4.5 mr-1" />
              Unfollow
            </UButton>
          ) : (
            <UButton
              type="primary"
              loading={this.loading}
              class="w-30 mr-10"
              size="small"
              onClick={() => handleFollowStartup('follow')}
            >
              <PlusOutlined class="w-4.5 mt-1 mb-3px" />
              Connect
            </UButton>
          )}
        </div>
        <div class="flex justify-between mt-9 ml-10 mr-10 mb-10">
          <div class="flex flex-col">
            <div class="flex gap-2">
              <div class="flex rounded-2px overflow-hidden h-6 px-2 py-1 text-primary1 border border-primary1">
                123123
              </div>
            </div>
            <p class="u-body2 mt-5 w-180 ">{this.mission}</p>
          </div>
          <div class="flex flex-wrap gap-4 items-end">
            {SocialTypeList.map(item => (
              <UPopover
                placement="top"
                v-slots={{
                  trigger: () => <SocialIcon icon={item.value} />,
                  default: () => <div class="flex m-3 cursor-pointer">{item.value}</div>
                }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
})
