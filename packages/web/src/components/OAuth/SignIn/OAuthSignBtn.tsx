import { defineComponent } from 'vue'
import styles from './OAuthSignBtn.module.css'

export default defineComponent({
  name: 'OAuthSignBtn',
  emits: ['triggerBtn'],
  setup(props, ctx) {
    const handleClick = () => {
      ctx.emit('triggerBtn')
    }
    return () => (
      <div class={styles.oauthBtn} onClick={handleClick}>
        {ctx.slots.default?.()}
      </div>
    )
  }
})
