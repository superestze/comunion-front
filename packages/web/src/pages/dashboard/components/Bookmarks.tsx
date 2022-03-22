import { UCard, UTabPane, UTabs } from '@comunion/components'
import { defineComponent } from 'vue'
import styles from './Shared.module.css'
import empty from '@/assets/empty.png'

const Bookmarks = defineComponent({
  name: 'Proposal',
  setup(props, ctx) {
    return () => (
      <UCard title="MY BOOKMARKS" size="small" class={styles.profileTitle}>
        <UTabs>
          <UTabPane name="COMEUPS" tab="COMEUPS">
            {' '}
          </UTabPane>
          <UTabPane name="BOUNTIES" tab="BOUNTIES">
            {' '}
          </UTabPane>
          <UTabPane name="COMERS" tab="COMERS">
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

export default Bookmarks
