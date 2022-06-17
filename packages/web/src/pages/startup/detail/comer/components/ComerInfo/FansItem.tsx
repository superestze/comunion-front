import { ULazyImage } from '@comunion/components'
import { defineComponent, PropType } from 'vue'
import { ServiceReturn } from '@/services'

type FansType = NonNullable<ServiceReturn<'account@comer-info-get'>>['followed']

export const FansItem = defineComponent({
  name: 'FansItem',
  props: {
    fansItem: Object as PropType<FansType[number]>
  },
  setup(props) {
    return () => (
      <div class="flex items-center cursor-pointer">
        <ULazyImage
          src={props.fansItem?.comerProfile?.avatar || ''}
          class="rounded-1/2 h-18 w-18 mr-4"
        />
        <div class="flex-1">
          <div class="u-title1">{props.fansItem?.comerProfile?.name}</div>
          <div class="flex u-body1">
            {props.fansItem?.comerProfile?.skills?.map((skill, skillIndex) => (
              <div key={skill.id}>
                <span class="u-body1">{skill.name}</span>
                {skillIndex + 1 !== props.fansItem?.comerProfile?.skills.length && (
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
