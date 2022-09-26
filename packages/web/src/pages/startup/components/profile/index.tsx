import { UButton, UPopover, UTag } from '@comunion/components'
import { defineComponent, computed, ref, watch, PropType } from 'vue'

import { useStartupProfile } from '../../hooks/useStartupProfile'
import defaultCover from './assets/cover.png'
import SocialIcon from '@/components/SocialIcon'
import StartupLogo from '@/components/StartupLogo'
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
      .then(res => {
        userIsFollow.value = !!res
      })
      .catch(() => {
        userIsFollow.value = false
      })

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
      <div class="bg-white border rounded-sm mb-6 overflow-hidden">
        <div class="h-13.125rem overflow-hidden">
          <img
            src={this.startupInfo?.cover || defaultCover}
            alt="bg"
            class="h-full object-cover w-full"
          />
          {!this.startupInfo?.cover && (
            <div class="text-right top-19 right-10 absolute">
              <div class="font-normal text-color2 u-h3">
                Nothing is more powerful than an idea whose time has come
              </div>
              <div class="mt-9 text-color3 u-h6">Victor Hugo</div>
            </div>
          )}
        </div>

        <div class="flex mt-2 px-10 justify-between relative">
          <StartupLogo
            src={this.startupInfo?.logo || ''}
            class="bg-white h-30 bottom-2 left-10 w-30 absolute"
          />
          <div class="pl-36">
            <div class="flex items-center">
              <p class="text-color1 u-h2">{this.startupInfo?.name}</p>
              {this.startupInfo && this.startupInfo.mode > 0 && (
                <UTag class="ml-4">{this.modeName}</UTag>
              )}
            </div>
            {this.theChainName && (
              <div class="rounded flex py-0.25rem items-center">
                <img
                  src={
                    this.startupInfo?.onChain
                      ? getChainInfoByChainId(this.props.startup.chainID)?.logo
                      : getChainInfoByChainId(this.props.startup.chainID)?.nologo
                  }
                  class="h-5 mr-2 w-5"
                />
                <span
                  class={`u-h7 truncate text-color3 ${
                    this.startupInfo?.onChain ? 'cursor-pointer hover:text-primary' : ''
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
              onClick={() => handleFollowStartup('unfollow')}
            >
              {/* <HookFilled class="mr-1 w-4.5" /> */}
              Unconnect
            </UButton>
          ) : (
            <UButton
              type="primary"
              loading={this.loading}
              onClick={() => handleFollowStartup('follow')}
            >
              {/* <PlusOutlined class="mt-1 mb-3px w-4.5" /> */}
              Connect
            </UButton>
          )}
        </div>
        <div class="flex mx-10 mt-6 mb-6 items-end">
          <div class="flex-1 overflow-hidden">
            <div class="flex gap-2">
              {Array.isArray(this.startupInfo?.hashTags) &&
                this.startupInfo?.hashTags.map((item: { name: string }, i: number) => {
                  return (
                    <UTag key={i} class="text-color1 ">
                      {item.name}
                    </UTag>
                  )
                })}
            </div>
            <p class="mt-2 max-w-[600px] text-color2 u-h6">{this.startupInfo?.mission}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            {this.socialList.map(item => (
              <UPopover
                placement="bottom"
                v-slots={{
                  trigger: () => this.getLinkTarget(item.socialLink, item.label),
                  default: () => <div class="cursor-pointer">{item.label}</div>
                }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
})
