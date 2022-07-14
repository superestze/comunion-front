import { UStartupLogo, UTag } from '@comunion/components'
import { defineComponent, PropType, computed } from 'vue'
import { getStartupTypeFromNumber, StartupTypesType, STARTUP_TYPES_COLOR_MAP } from '@/constants'
import { SocialGroup } from '@/pages/startup/components/SocialGroup'
import { StartupItem } from '@/types'

export default defineComponent({
  props: {
    startup: {
      type: Object as PropType<StartupItem>,
      require: true
    }
  },
  setup(props, ctx) {
    const modeName = computed(
      () => getStartupTypeFromNumber(props.startup!.mode) as StartupTypesType
    )

    const hashtagsArray = computed(() =>
      props.startup!.hashTags.map(key => {
        return key.name
      })
    )

    return () => (
      <div>
        <div class="flex">
          <div class="w-80px h-80px">
            <UStartupLogo
              src={props.startup?.logo || ''}
              width="20"
              height="20"
              class="rounded !object-contain"
            />
          </div>
          <div class="flex flex-col ml-24px">
            <div class="flex items-center mb-12px">
              <span class="u-h2">{props.startup!.name}</span>
            </div>
            {props.startup!.mode > 0 && (
              <UTag
                class="!u-body3-pure"
                type="filled"
                bgColor={STARTUP_TYPES_COLOR_MAP[modeName.value]}
              >
                {modeName.value}
              </UTag>
            )}
          </div>
        </div>
        <div class={['flex flex-wrap gap-2 mt-20px']}>
          {hashtagsArray.value.slice(0, 4).map((key, value) => {
            return value + 1 < 4 && <UTag key={value}>{key}</UTag>
          })}

          {hashtagsArray.value.length - 3 > 1 ? (
            <UTag>+ {hashtagsArray.value.length - 3}</UTag>
          ) : null}
        </div>
        <p class="text-14px text-grey1 mt-24px">
          Chainalysis is the blockchain data platform. We provide data, soft, Chainalysis is the
          blockchain data platform.
        </p>
        <SocialGroup
          discord={props.startup?.discord}
          website={props.startup?.website}
          telegram={props.startup?.telegram}
          twitter={props.startup?.twitter}
          docs={props.startup?.docs}
          class="flex gap-4 mt-7"
        />
      </div>
    )
  }
})
