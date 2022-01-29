import { defineComponent } from 'vue'
import { ArrowRightOutlined } from '@comunion/icons'
import { useRouter } from 'vue-router'
import './index.css'

type UBackProps = {
  onClick: (e: MouseEvent) => void
}

export default defineComponent<UBackProps>({
  name: 'UBack',
  setup(props, { slots }) {
    const router = useRouter()
    const handleClick = () => {
      router.go(-1)
    }
    return () => (
      <div class="u-back flex" onClick={props.onClick ?? handleClick}>
        <ArrowRightOutlined class="u-back-icon transform rotate-90 origin-center" />
        <div class="u-back-text">{slots.default?.() ?? 'BACK'}</div>
      </div>
    )
  }
})
