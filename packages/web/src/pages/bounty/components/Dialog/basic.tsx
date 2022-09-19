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
  emits: ['triggerDialog'],
  render() {
    const triggerDialog = () => {
      this.$emit('triggerDialog')
    }

    return (
      <UModal show={this.visible}>
        <UCard
          style={{
            width: '600px',
            '--n-title-text-color': '#3F2D99',
            '--n-close-icon-color': '#3F2D99'
          }}
          bordered={false}
          size="huge"
          role="dialog"
          aria-modal="true"
          closable
          onClose={triggerDialog}
          v-slots={{
            header: () => (
              <div>
                <div>{this.title}</div>
              </div>
            )
          }}
        >
          <p class="min-h-20 p-4 text-color2 u-h6">{this.content}</p>
          {this.$slots.btns && this.$slots.btns()}
        </UCard>
      </UModal>
    )
  }
})
