import { StartupLogoFilled } from '@comunion/icons'
import type { ExtractPropTypes } from 'vue'
import { defineComponent, ref, watch } from 'vue'

export const UStartupLogoProps = {
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String
  },
  onClick: {
    type: Function
  }
} as const

export type UStartupLogoPropsType = ExtractPropTypes<typeof UStartupLogoProps>

const UStartupLogo = defineComponent({
  name: 'UStartupLogo',
  props: UStartupLogoProps,
  setup(props, ctx) {
    const loaded = ref(false)
    const errored = ref(false)

    watch(
      () => props.src,
      () => {
        errored.value = false
        loaded.value = false
        const img = new Image()
        img.onload = () => {
          loaded.value = true
        }
        img.onerror = () => {
          errored.value = true
        }
        img.src = props.src
      },
      {
        immediate: true
      }
    )
    return () =>
      loaded.value ? (
        <img
          class="rounded h-full object-cover w-full"
          src={props.src}
          alt={props.alt}
          {...{ loading: 'lazy' }}
          {...ctx.attrs}
          onClick={() => typeof props.onClick === 'function' && props.onClick()}
        />
      ) : (
        <div
          class={[
            'rounded border-1 border-color-border w-full h-full flex items-center',
            { failed: errored.value }
          ]}
          {...ctx.attrs}
          onClick={() => typeof props.onClick === 'function' && props.onClick()}
        >
          {errored.value && <StartupLogoFilled class="m-auto h-7/10 w-7/10" />}
        </div>
      )
  }
})

export default UStartupLogo
