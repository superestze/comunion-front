import { UStartupLogo, UPopover } from '@comunion/components'
import { defineComponent, ref, PropType } from 'vue'
import { TeamHoverCard } from '../../../components/Teams/TeamHoverCard'
import { ServiceReturn } from '@/services'

type StartupInfo = NonNullable<ServiceReturn<'startup@startup-list-be-member'>>['list']

export const StartupInfoItem = defineComponent({
  name: 'StartupInfoItem',
  props: {
    startupInfo: Object as PropType<StartupInfo[number]>
  },
  setup(props) {
    const comerID = ref({
      comerProfile: {
        comerID: props.startupInfo?.comerID,
        avatar: props.startupInfo?.logo || '',
        name: props.startupInfo?.name,
        skills: props.startupInfo?.hashTags
      }
    })
    return () => (
      <div class="flex items-center">
        {/* <UStartupLogo
          src={props.startupInfo?.logo || ''}
          height="16"
          width="16"
          class="rounded-1/2 h-20 w-20 mr-4"
        /> */}
        <UPopover
          placement="left-start"
          v-slots={{
            trigger: () => (
              <UStartupLogo
                src={props.startupInfo?.logo || ''}
                height="16"
                width="16"
                class="rounded-1/2 h-20 w-20 mr-4"
              />
            ),
            default: () => <TeamHoverCard teamMember={comerID.value} />
          }}
        />
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
