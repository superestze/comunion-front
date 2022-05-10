import { NTabs, TabsProps } from 'naive-ui'
import { defineComponent } from 'vue'
import './index.css'

export type UTabsPropsType = TabsProps

// const UTabs: typeof NTabs = NTabs
// UTabs.name = 'UTabs'

const UTabs = defineComponent({
  name: 'UTabs',
  extends: NTabs,
  setup(props, ctx) {
    return () => <NTabs {...props} class="u-tabs" v-slots={ctx.slots} />
  }
})

export default UTabs
