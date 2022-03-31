import { UButton } from '@comunion/components'
import { defineComponent, PropType } from 'vue'
import styles from './StartupCard.module.css'
import { StartupItem } from '@/types'

const StartupCard = defineComponent({
  name: 'StartupCard',
  props: {
    startup: {
      type: Object as PropType<StartupItem>
    }
  },
  setup(props, context) {
    const { startup } = props

    const setStartup = () => {
      console.log('set startup')
    }
    return () => (
      <div class={styles.startupCard}>
        <div class={styles.cardLeft}>
          <img src={startup.logo} alt="" />
        </div>
        <div class={styles.cardRight}>
          <div class={styles.content}>
            <div class={styles.name}>{startup.name}</div>
            <div class={styles.skills}>
              {/* TODO */}
              <span>Graphic design</span>
              <span>UI design</span>
              <span>Marketing</span>
            </div>
          </div>
          <div>
            <UButton class={styles.setBtn} type="primary" onClick={setStartup}>
              Set
            </UButton>
          </div>
        </div>
      </div>
    )
  }
})

export default StartupCard
