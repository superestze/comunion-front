import { defineComponent } from 'vue'
import H1 from '../title/h1'

export default defineComponent({
  render() {
    return (
      <div class="mt-100px">
        <H1 text="The First" />
        <H1 class="mt-26px" text="Permissionless Economic Network " color="#5E18FE" />
      </div>
    )
  }
})
