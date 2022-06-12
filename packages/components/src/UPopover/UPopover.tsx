import { NPopover, PopoverProps } from 'naive-ui'
import { defineAsyncComponent } from 'vue'

export type UPopoverProps = PopoverProps

export const UPopover = defineAsyncComponent({
  loader: () => Promise.resolve(NPopover)
  // name: 'UPopover',
  // extends: NPopover,
  // setup(props, ctx) {
  //   return () => <NPopover {...props} v-slots={ctx.slots} />
  // }
})
