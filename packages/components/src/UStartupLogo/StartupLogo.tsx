import { StartupLogoFilled } from '@comunion/icons'
import type { ExtractPropTypes } from 'vue'
import { defineComponent, ref, watch } from 'vue'
import '../ULazyImage/LazyImage.css'

export const UStartupLogoProps = {
  width: {
    type: String,
    required: true
  },
  height: {
    type: String,
    required: true
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
          class="u-lazy-image-img"
          src={props.src}
          alt={props.alt}
          {...{ loading: 'lazy' }}
          {...ctx.attrs}
        />
      ) : (
        <div class={['border-1 border-grey5 flex', { failed: errored.value }]} {...ctx.attrs}>
          {errored.value ? (
            <StartupLogoFilled class={`w-${props.width} h-${props.height} m-auto`} />
          ) : (
            ''
          )}
        </div>
      )
  }
})

export default UStartupLogo
