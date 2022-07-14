import { UCard, UModal } from '@comunion/components'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      require: true
    },
    title: {
      type: String,
      require: true
    },
    content: {
      type: String,
      require: true
    }
  },
  setup() {
    const handleClose = () => {
      // todo
    }
    return {
      handleClose
    }
  },
  render() {
    console.log(this.$slots)
    return (
      <UModal show={this.visible}>
        <UCard
          style="width: 600px"
          // title="Modal"
          bordered={false}
          size="huge"
          role="dialog"
          aria-modal="true"
          closable
          onClose={this.handleClose}
          v-slots={{
            header: () => (
              <div>
                <div>{this.title}</div>
              </div>
            )
          }}
        >
          <p class="text-grey3">{this.content}</p>
          {this.$slots.btns && this.$slots.btns()}
        </UCard>
      </UModal>
    )
  }
})
