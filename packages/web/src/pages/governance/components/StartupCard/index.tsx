import { UStartupLogo, UTag } from '@comunion/components'
import { defineComponent, PropType, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getStartupTypeFromNumber, StartupTypesType } from '@/constants'
import { SocialGroup } from '@/pages/startup/components/SocialGroup'
import { ServiceReturn } from '@/services'

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
          <div class="w-15 h-15" onClick={this.toComerDetail}>
            <UStartupLogo
              src={this.startup?.logo || ''}
              width="15"
              height="15"
              class="rounded !object-contain cursor-pointer"
            />
          </div>
          <div class="flex-1 flex flex-col ml-6 truncate">
            <div class="flex items-center mb-12px">
              <span class="u-h2 w-full truncate">{this.startup?.name}</span>
            </div>
            <div class="flex">
              {(this.startup?.mode || 0) > 0 && (
                // STARTUP_TYPES_COLOR_MAP[this.modeName]
                <UTag
                  class="border-1 border-[#DADCE0] !text-color2 font-primary !text-xs !h-5"
                  type="filled"
                  bgColor={''}
                >
                  {this.modeName}
                </UTag>
              )}
            </div>
          </div>
        </div>
        <div class={['flex flex-wrap gap-2 mt-20px']}>
          {(this.tags || []).slice(0, 4).map((value, $index) => {
            return $index + 1 < 4 && <UTag key={value}>{value}</UTag>
          })}

          {(this.tags || []).length - 3 > 1 ? <UTag>+ {(this.tags || []).length - 3}</UTag> : null}
        </div>
        <p class="font-opensans text-color2 break-all line-clamp-2 mt-4">{this.startup?.mission}</p>
        <SocialGroup
          discord={this.startup?.discord}
          website={this.startup?.website}
          telegram={this.startup?.telegram}
          twitter={this.startup?.twitter}
          docs={this.startup?.docs}
          class="flex gap-4 mt-7"
        />
      </div>
    )
  }
})
