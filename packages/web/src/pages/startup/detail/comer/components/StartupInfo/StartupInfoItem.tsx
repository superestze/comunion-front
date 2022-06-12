import { ULazyImage } from '@comunion/components'
import { defineComponent, PropType } from 'vue'
import { StartupItem } from '@/types'

export const StartupInfoItem = defineComponent({
  name: 'StartupInfoItem',
  props: {
    startupInfo: Object as PropType<StartupItem>
  },
  setup(props) {
    return (
      <div key={props.startupInfo?.id}>
        <ULazyImage src={props.startupInfo?.logo || ''} />
        <div>
          <div>{props.startupInfo?.name}</div>
          <div class="flex">
            {props.startupInfo?.hashTags.map(hashTag => (
              <div key={hashTag.id}>
                <span class="u-body1">{hashTag.name}</span>
                <span class="u-grey5 mx-2">|</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
})
