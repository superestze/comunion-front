import { StartupLogoFilled } from '@comunion/icons'
import type { ExtractPropTypes } from 'vue'
import { defineComponent, ref, watch } from 'vue'
import '../ULazyImage/LazyImage.css'

export const UStartupLogoProps = {
  width: {
    type: String,
    default: 0
  },
  height: {
    type: String,
    default: 0
  },
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String
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
        />
      ) : (
        <div
          class={[
            'rounded border-1 border-color-border w-full h-full flex items-center',
            { failed: errored.value }
          ]}
          {...ctx.attrs}
        >
          {errored.value && (
            <StartupLogoFilled
              class={`${props.width ? 'w-' + props.width : 'w-full'} ${
                props.height ? 'h-' + props.height : 'h-full'
              } m-auto`}
            />
          )}
        </div>
      )
  }
})

export default UStartupLogo
