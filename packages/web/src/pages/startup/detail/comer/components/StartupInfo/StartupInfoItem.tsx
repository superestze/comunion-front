import { UStartupLogo, UPopover } from '@comunion/components'
import { defineComponent, ref, onMounted } from 'vue'
import { TeamHoverCard } from '../../../components/Teams/TeamHoverCard'
// import { ServiceReturn } from '@/services'

// type StartupInfo = NonNullable<ServiceReturn<'startup@startup-list-be-member'>>['list']

export const StartupInfoItem = defineComponent({
  name: 'StartupInfoItem',
  // props: {
  //   startupInfo: Object as PropType<StartupInfo[number]>
  // },
  props: ['startupInfo'],
  setup(props) {
    const startupInfo = props.startupInfo
    const comerID = ref({
      comerProfile: {
        comerID: (startupInfo.comerProfile = props.startupInfo.comerID),
        avatar: (startupInfo.comerProfile = props.startupInfo.logo || ''),
        name: (startupInfo.comerProfile = props.startupInfo.name),
        location: (startupInfo.comerProfile = props.startupInfo.location),
        skills: (startupInfo.comerProfile = props.startupInfo.hashTags)
      }
    })
    onMounted(() => {
      startupInfo.comerProfile = comerID.value.comerProfile
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
            default: () => <TeamHoverCard teamMember={startupInfo} />
          }}
        />
        <div class="flex-1 truncate">
          <div class="u-title1 truncate">{props.startupInfo?.name}</div>
          <div class="flex u-body1 mt-2">
            {props.startupInfo?.hashTags.map((hashTag: any, hashTagIndex: any) => (
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
