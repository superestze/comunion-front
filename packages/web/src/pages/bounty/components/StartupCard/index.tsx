import { UStartupLogo, UTag } from '@comunion/components'
import { defineComponent, PropType, computed } from 'vue'
import { getStartupTypeFromNumber, StartupTypesType } from '@/constants'
import { SocialGroup } from '@/pages/startup/components/SocialGroup'
import { ServiceReturn } from '@/services'

export default defineComponent({
  name: 'StartupCard',
  props: {
    startup: {
      type: Object as PropType<ServiceReturn<'bounty@bounty-startup-list'>>,
      require: true
    }
  },
  setup(props) {
    const modeName = computed(
      () => getStartupTypeFromNumber(props.startup?.mode || 0) as StartupTypesType
    )
    const tags = computed<string[]>(() => {
      if (Array.isArray(props.startup?.tag)) {
        return props.startup?.tag as string[]
      }
      return []
    })

    return {
      modeName,
      tags
    }
  },
  render() {
    return (
      <>
        <div class="flex ">
          <UStartupLogo
            src={this.startup?.logo || ''}
            width="15"
            height="15"
            class="rounded-sm h-15 mr-4 w-15"
          />
          <div class="flex-1 overflow-hidden">
            <div class="mb-2 truncate font-primary font-semibold text-[20px] text-color1">
              {this.startup?.title}
            </div>
            {(this.startup?.mode || 0) > 0 && (
              <span class="rounded-sm h-1.25rem mr-2 px-2 text-0.75rem text-color2 leading-1.25rem inline-block border-1 border-[#DADCE0]">
                {this.modeName}
              </span>
            )}
          </div>
        </div>
        {this.tags.length > 0 && (
          <div class="flex flex-wrap mt-5 gap-2 text-[#211B42]">
            {this.tags.slice(0, 4).map((value, $index) => {
              return <UTag key={`tag_${$index}`}>{value}</UTag>
            })}

            {this.tags.length - 4 > 0 ? <UTag>+ {this.tags.length - 4}</UTag> : null}
          </div>
        )}
        {this.startup?.mission && (
          <p class="mt-6 text-color1 u-body2 line-clamp-2 text-color3">{this.startup?.mission}</p>
        )}
        <SocialGroup
          discord={this.startup?.discord}
          website={this.startup?.website}
          telegram={this.startup?.telegram}
          twitter={this.startup?.twitter}
          docs={this.startup?.docs}
          email={this.startup?.email}
          medium={this.startup?.medium}
          facebook={this.startup?.facebook}
          class="flex mt-4 gap-4"
        />
      </>
    )
  }
})
