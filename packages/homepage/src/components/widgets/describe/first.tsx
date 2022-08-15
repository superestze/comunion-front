import { defineComponent } from 'vue'
import H1 from '../title/h1'

export default defineComponent({
  render() {
    return (
      <div class="mt-25 relative">
        <H1 text="The First" />
        <H1 class="mt-6.5" text="Permissionless Economic Network " color="#5E18FE" />
      </div>
    )
  }
})
