import { UButton, UPopover, UStartupLogo, UTag } from '@comunion/components'
import { defineComponent, computed, ref, watch, PropType } from 'vue'

import { useStartupProfile } from '../../hooks/useStartupProfile'
import defaultCover from './assets/cover.png'
import SocialIcon from '@/components/SocialIcon'
import { getStartupTypeFromNumber, StartupTypesType } from '@/constants'
import { getContactList } from '@/pages/startup/setting/[id]'
import { contactList } from '@/pages/startup/setting/components/social/util'
import { useChainStore } from '@/stores'
import { StartupDetail } from '@/types'
import { getChainInfoByChainId } from '@/utils/etherscan'
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
    const chainStore = useChainStore()
    const modeName = computed(() => {
      return getStartupTypeFromNumber(props.startup.mode) as StartupTypesType
    })
    const userIsFollow = ref<boolean>(false)
    const loading = ref<boolean>(false)
    const profile = useStartupProfile()
    const { toggleFollowStartup, getUserIsFollow } = profile
    let theChainName = getChainInfoByChainId(props.startup.chainID)?.shortName
    getUserIsFollow(props.startupId)
      .then(() => (userIsFollow.value = true))
      .catch(() => (userIsFollow.value = false))

    const startupInfo = ref<StartupDetail & { onChain: boolean }>()

    watch(
      () => props.startup,
      () => {
        startupInfo.value = props.startup
        if (startupInfo.value.onChain) {
          theChainName = startupInfo.value.blockChainAddress
          if (theChainName.length > 11) {
            theChainName =
              startupInfo.value.blockChainAddress.substring(0, 7) +
              '...' +
              startupInfo.value.blockChainAddress.substring(
                startupInfo.value.blockChainAddress.length - 5,
                startupInfo.value.blockChainAddress.length - 1
              )
          }
        } else {
          theChainName = 'Non-Blockchian'
        }
      },
      {
        immediate: true
      }
    )

    const socialList = computed(() => {
      return (startupInfo.value ? getContactList(startupInfo.value) : []).map(item => {
        const targetIndex = contactList.findIndex(type => type.value === item.socialType)
        return {
          ...item,
          label: targetIndex === -1 ? '' : contactList[targetIndex].label
        }
      })
    })
    const getLinkTarget = (link: string, label: string) => {
      if (link) {
        return (
          <a href={link} target="_blank">
            <SocialIcon icon={label} outWrapper="w-10 h-10" />
          </a>
        )
      } else {
        return (
          <span>
            <SocialIcon icon={label} disable outWrapper="w-10 h-10" />
          </span>
        )
      }
    }
    const goPath = () => {
      if (startupInfo.value?.onChain) {
        chainStore.goTxHashPath(startupInfo.value?.chainID, startupInfo.value.blockChainAddress)
      }
    }
    return {
      modeName,
      toggleFollowStartup,
      userIsFollow,
      loading,
      startupInfo,
      socialList,
      theChainName,
      props,
      getLinkTarget,
      goPath
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
              src={this.startupInfo?.logo || ''}
              width="30"
              height="30"
              class="bg-white rounded-md h-full w-full !object-cover"
            />
          </div>
          <div>
            <div class="flex items-center">
              <p class="ml-46 u-h2">{this.startupInfo?.name}</p>
              {this.startupInfo && this.startupInfo.mode > 0 && (
                <UTag
                  class="border-1 border-gray-500/50 ml-5 u-6 !h-6.5 !text-color2"
                  type="filled"
                  bgColor="#fffffff"
                >
                  {this.modeName}
                </UTag>
              )}
            </div>
            {this.theChainName && (
              <div class="rounded flex ml-46 py-0.25rem items-center">
                <img
                  src={
                    this.startupInfo?.onChain
                      ? getChainInfoByChainId(this.props.startup.chainID)?.logo
                      : getChainInfoByChainId(this.props.startup.chainID)?.nologo
                  }
                  class="h-1.25rem mr-0.2rem w-1.25rem"
                />
                <span
                  class={`text-12px truncate ${
                    this.startupInfo?.onChain ? 'cursor-pointer' : 'text-[#E0E0E0]'
                  }`}
                  onClick={() => this.goPath()}
                >
                  {this.theChainName}
                </span>
              </div>
            )}
          </div>
          {this.userIsFollow ? (
            <UButton
              type="primary"
              loading={this.loading}
              ghost
              class="font-primary font-semibold mr-10 pr-4.25 pl-4.25 text-4"
              style={{
                '--n-border-radius': '2px'
              }}
              size="small"
              onClick={() => handleFollowStartup('unfollow')}
            >
              {/* <HookFilled class="mr-1 w-4.5" /> */}
              Unconnect
            </UButton>
          ) : (
            <UButton
              type="primary"
              loading={this.loading}
              class="font-primary font-semibold mr-10 pr-4.25 pl-4.25 text-4"
              style={{
                '--n-border-radius': '2px'
              }}
              size="small"
              onClick={() => handleFollowStartup('follow')}
            >
              {/* <PlusOutlined class="mt-1 mb-3px w-4.5" /> */}
              Connect
            </UButton>
          )}
        </div>
        <div class="flex mt-9 mr-10 mb-10 ml-10 justify-between">
          <div class="flex w-[100%] items-end justify-between">
            <div class="w-[60%]">
              <div class="flex gap-2">
                {Array.isArray(this.startupInfo?.hashTags) &&
                  this.startupInfo?.hashTags.map((item: { name: string }, i: number) => {
                    return (
                      <UTag key={i} class="!border-1 !border-gray-500/50 !u-h6">
                        {item.name}
                      </UTag>
                    )
                  })}
              </div>
              <p class="mt-5 text-color2 w-[100%] u-h6">{this.startupInfo?.mission}</p>
            </div>
            <div class="flex flex-wrap -mb-[8px] gap-4">
              {this.socialList.map(item => (
                <UPopover
                  placement="bottom"
                  v-slots={{
                    trigger: () => this.getLinkTarget(item.socialLink, item.label),
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
