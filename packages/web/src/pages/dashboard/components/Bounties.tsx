import { UCard, UTabPane, UTabs } from '@comunion/components'
import { defineComponent } from 'vue'
import styles from './Shared.module.css'
import empty from '@/assets/empty.png'

const Bounties = defineComponent({
  name: 'Bounties',
  setup(prop, ctx) {
    return () => (
      <UCard title="MY BOUNTIES" size="small" class={styles.profileTitle}>
        <UTabs>
          <UTabPane name="WHAT I SIGNED UP" tab="WHAT I SIGNED UP">
            {' '}
          </UTabPane>
          <UTabPane name="PUBLISHED BY ME" tab="PUBLISHED BY ME">
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

export default Bounties
