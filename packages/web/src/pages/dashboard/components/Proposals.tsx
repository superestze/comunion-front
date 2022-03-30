import { UCard, UTabPane, UTabs } from '@comunion/components'
import { defineComponent } from 'vue'
import styles from './Shared.module.css'
import empty from '@/assets/empty.png'

const Proposals = defineComponent({
  name: 'Proposal',
  setup(props, ctx) {
    return () => (
      <UCard title="MY PROPOSALS" size="small" class={styles.cardTitle}>
        <UTabs>
          <UTabPane name="WHAT I PARTICIPATED" tab="WHAT I PARTICIPATED">
            {' '}
          </UTabPane>
          <UTabPane name="INITIATED BY ME" tab="INITIATED BY ME">
            {' '}
          </UTabPane>
        </UTabs>
        <div class={styles.empty}>
          <img class={styles.emptyImg} src={empty} />
        </div>
      </UCard>
    )
  }
})

export default Proposals
