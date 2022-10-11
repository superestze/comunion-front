import { UTag } from '@comunion/components'
import { defineComponent, PropType, computed } from 'vue'
import { useRouter } from 'vue-router'
import StartupLogo from '@/components/StartupLogo'
import { getStartupTypeFromNumber, StartupTypesType } from '@/constants'
import { SocialGroup } from '@/pages/startup/components/SocialGroup'
import { ServiceReturn } from '@/services'
import { getChainInfoByChainId } from '@/utils/etherscan'

export default defineComponent({
  props: {
    startup: {
      type: Object as PropType<ServiceReturn<'startup@startup-get'>>,
      require: true
    }
  },
  setup(props) {
    const router = useRouter()
    const toComerDetail = () => {
      router.push({ path: `/startup/${props.startup?.id}` })
    }

    const modeName = computed(
      () => getStartupTypeFromNumber(props.startup?.mode || 0) as StartupTypesType
    )
    const tags = computed<string[] | undefined>(() => {
      if (Array.isArray(props.startup?.hashTags)) {
        return props.startup?.hashTags.map(item => item.name)
      }
      return []
    })

    return {
      modeName,
      tags,
      toComerDetail
    }
  },
  render() {
    return (
      <div>
        <div class="flex">
          <div class="cursor-pointer h-15 mr-4 min-w-15" onClick={this.toComerDetail}>
            <StartupLogo src={this.startup?.logo || ''} />
          </div>
          <div class="flex-1">
            <div class="mb-3 text-color1 truncate u-h3">{this.startup?.name}</div>
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
        <div class={['flex flex-wrap gap-2 mt-4']}>
          {(this.tags || []).slice(0, 4).map((value, $index) => {
            return $index + 1 < 4 && <UTag key={value}>{value}</UTag>
          })}

          {(this.tags || []).length - 3 > 1 ? <UTag>+ {(this.tags || []).length - 3}</UTag> : null}
        </div>
        <p class="mt-4 text-color2 break-all u-h5 line-clamp-2">{this.startup?.mission}</p>
        <SocialGroup
          discord={this.startup?.discord}
          website={this.startup?.website}
          telegram={this.startup?.telegram}
          twitter={this.startup?.twitter}
          docs={this.startup?.docs}
          class="flex mt-6 gap-4"
        />
      </div>
    )
  }
})
