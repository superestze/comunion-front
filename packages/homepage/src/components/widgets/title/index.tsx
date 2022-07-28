import { defineComponent } from 'vue'
import H1 from './h1'
import Subtitle from './subtitle'

export default defineComponent({
  props: {
    title: {
      type: String,
      require: true
    },
    subTitle: {
      type: String
    }
  },
  render() {
    return (
      <div>
        <H1 class="mt-240px" text={this.title || ''} />
        {this.subTitle && (
          <Subtitle class="mt-22px w-886px text-center mx-auto" text={this.subTitle || ''} />
        )}
      </div>
    )
  }
})
