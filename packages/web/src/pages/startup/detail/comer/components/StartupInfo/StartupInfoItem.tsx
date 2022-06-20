import { ULazyImage } from '@comunion/components'
import { defineComponent, PropType } from 'vue'
import { ServiceReturn } from '@/services'

type StartupInfo = NonNullable<ServiceReturn<'startup@startup-list-be-member'>>['list']

export const StartupInfoItem = defineComponent({
  name: 'StartupInfoItem',
  props: {
    startupInfo: Object as PropType<StartupInfo[number]>
  },
  setup(props) {
    return () => (
      <div class="flex items-center">
        <ULazyImage src={props.startupInfo?.logo || ''} class="rounded-1/2 h-20 w-20 mr-4" />
        <div class="flex-1 truncate">
          <div class="u-title1 truncate">{props.startupInfo?.name}</div>
          <div class="flex u-body1 mt-2">
            {props.startupInfo?.hashTags.map((hashTag, hashTagIndex) => (
              <div key={hashTag.id} class="truncate">
                <span class="u-body1">{hashTag.name}</span>
                {hashTagIndex + 1 !== props.startupInfo?.hashTags.length && (
                  <span class="u-grey5 mx-2">|</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
})
