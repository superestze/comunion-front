import { defineComponent } from 'vue'
import styles from './index.module.css'

const HeaderButton = defineComponent({
  name: 'HeaderButton',
  emits: ['click'],
  setup(props, ctx) {
    return () => (
      <div class={styles.btn} {...ctx.attrs} onClick={() => ctx.emit('click')}>
        {ctx.slots.default?.()}
      </div>
    )
  }
})

export default HeaderButton
