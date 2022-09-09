import { defineComponent, PropType, ref } from 'vue'
import { PayDailog } from '../Dialog'
import { ProjectCard, BountyProjectCardType } from '.'

export default defineComponent({
  name: 'ProjectCardWithDialog',
  props: {
    info: {
      type: String as PropType<BountyProjectCardType>,
      require: true
    },
    payMode: {
      type: String as PropType<'stage' | 'period'>,
      require: true
    },
    detailChainId: {
      type: Number,
      default: () => 0
    }
  },
  setup() {
    const visible = ref<boolean>(false)
    return {
      visible
    }
  },
  render() {
    const triggerDialog = () => {
      this.visible = !this.visible
    }
    return (
      <>
        <PayDailog
          detailChainId={this.detailChainId}
          onTriggerDialog={triggerDialog}
          visible={this.visible}
          paymentInfo={this.info}
        />
        <ProjectCard info={this.info} onPay={triggerDialog} payMode={this.payMode} />
      </>
    )
  }
})
