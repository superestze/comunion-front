import { ULazyImage, UPopover } from '@comunion/components'
import { defineComponent, PropType, ref } from 'vue'
import { useRouter } from 'vue-router'
import { TeamHoverCard } from '../../../components/Teams/TeamHoverCard'
import { ServiceReturn } from '@/services'

type FansType = NonNullable<ServiceReturn<'account@comer-info-get'>>['followed']

export const FansItem = defineComponent({
  name: 'FansItem',
  props: {
    fansItem: Object as PropType<FansType[number]>
  },
  setup(props) {
    const router = useRouter()
    const toComerDetail = () => {
      props.fansItem?.comerID && router.push({ path: `/comer?id=${props.fansItem?.comerID}` })
    }
    const comerID = ref({
      comerProfile: {
        comerID: props.fansItem?.comerProfile?.comerID,
        avatar: props.fansItem?.comerProfile?.avatar,
        name: props.fansItem?.comerProfile?.name,
        location: props.fansItem?.comerProfile?.location,
        skills: props.fansItem?.comerProfile?.skills
      }
    })

    return () => (
      <div class="flex items-center cursor-pointer" onClick={toComerDetail}>
        <UPopover
          placement="left-start"
          v-slots={{
            trigger: () => (
              <ULazyImage
                src={props.fansItem?.comerProfile?.avatar || ''}
                class="rounded-1/2 h-18 w-18 mr-4"
              />
            ),
            default: () => <TeamHoverCard teamMember={comerID.value} />
          }}
        />
        <div class="flex-1 min-w-0">
          <div class="u-title1">{props.fansItem?.comerProfile?.name}</div>
          <div class="truncate u-body1">
            {props.fansItem?.comerProfile?.skills?.map(skill => skill.name).join(' | ')}
            {/* map((skill, skillIndex) => (
              <span class="truncate" key={skill.id}>
                <span class="u-body1">11111111{skill.name}</span>
                {skillIndex + 1 !== props.fansItem?.comerProfile?.skills.length && (
                  <span class="u-grey5 mx-2">|</span>
                )}
              </span>
            ))} */}
          </div>
        </div>
      </div>
    )
  }
})
