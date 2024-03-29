import { UTag } from '@comunion/components'
import { defineComponent, PropType, computed } from 'vue'
import { useRouter } from 'vue-router'
import SocialIcon from '@/components/SocialIcon'
import StartupLogo from '@/components/StartupLogo'
import { getStartupTypeFromNumber, StartupTypesType } from '@/constants'
import { getContactList } from '@/pages/startup/setting/[id]'
import { contactList } from '@/pages/startup/setting/components/social/util'
import { ServiceReturn } from '@/services'
import { getChainInfoByChainId } from '@/utils/etherscan'

export default defineComponent({
  name: 'StartupCard',
  props: {
    startup: {
      type: Object as PropType<ServiceReturn<'bounty@bounty-startup-list'>>,
      require: true
    }
  },
  setup(props) {
    const router = useRouter()
    const toComerDetail = () => {
      props.startup?.id && router.push({ path: `/startup/${props.startup.id}` })
    }
    const modeName = computed(
      () => getStartupTypeFromNumber(props.startup?.mode || 0) as StartupTypesType
    )
    const tags = computed<string[]>(() => {
      if (Array.isArray(props.startup?.tag)) {
        return props.startup?.tag as string[]
      }
      return []
    })

    const socialList = computed(() => {
      return (props.startup ? getContactList(props.startup) : []).map(item => {
        const targetIndex = contactList.findIndex(type => type.value === item.socialType)
        return {
          ...item,
          label: targetIndex === -1 ? '' : contactList[targetIndex].label
        }
      })
    })

    return {
      modeName,
      tags,
      toComerDetail,
      socialList
    }
  },
  render() {
    return (
      <>
        <div class="flex ">
          <StartupLogo
            src={this.startup?.logo || ''}
            class="cursor-pointer h-15 mr-4 w-15"
            onClick={this.toComerDetail}
          />
          <div class="flex-1 overflow-hidden">
            <div class="mb-2 text-color1 truncate u-h3">{this.startup?.title}</div>
            <div class="flex items-center">
              {(this.startup?.mode || 0) > 0 && <UTag class="text-color2">{this.modeName}</UTag>}
              {this.startup?.chainID ? (
                <img
                  src={getChainInfoByChainId(this.startup?.chainID)?.logo}
                  class="h-4 ml-2 w-4"
                  title={getChainInfoByChainId(this.startup.chainID)?.shortName}
                />
              ) : null}
            </div>
          </div>
        </div>
        {this.tags.length > 0 && (
          <div class="flex flex-wrap mt-4 gap-2">
            {this.tags.slice(0, 4).map((value, $index) => {
              return <UTag key={`tag_${$index}`}>{value}</UTag>
            })}

            {this.tags.length - 4 > 0 ? <UTag>+ {this.tags.length - 4}</UTag> : null}
          </div>
        )}
        {this.startup?.mission && (
          <p class="mt-2 text-color2 u-h5 line-clamp-2">{this.startup?.mission}</p>
        )}
        <div class="flex mt-4 gap-6">
          {this.socialList.map(item => (
            <SocialIcon icon={item.label} disable={!item.socialLink} address={item.socialLink} />
          ))}
        </div>
      </>
    )
  }
})
