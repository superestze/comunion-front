import { defineComponent } from 'vue'
import styles from './ComeupsCard.module.css'

const ComeupsCard = defineComponent({
  name: 'ComeupsCard',
  setup(props, ctx) {
    return () => <div class={styles.ComesUpCard}>111</div>
  }
})
