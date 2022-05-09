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
        <div class={['border-1 border-primary1 flex', { failed: errored.value }]} {...ctx.attrs}>
          {errored.value ? (
            <svg
              width={props.width}
              height={props.height}
              viewBox="0 0 36 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="m-auto"
            >
              <path d="M18 36H30.8546L36 40.8005V48H18V36Z" fill="#1EE3CF" />
              <path d="M16.6181 36H5.14543L0 40.8005V48H16.6181V36Z" fill="#FF9D00" />
              <path
                d="M4.02071 17.4014C7.97409 6.67455 16.3659 7.22394 22.5919 3.21909C23.0789 2.90651 23.7027 2.93016 24.1658 3.27877C24.6289 3.62738 24.8376 4.23035 24.6923 4.80015L23.3268 10.1598L31.9078 18.6269L32 20.5983L28.9198 24.28L27.108 24.5584L22.621 21.6573L19.9458 22.0849V23.2583L28.1388 31.2555L28.6724 32.6651L28.6918 34H7.68305C7.68305 34 7.47931 33.8185 7.21252 33.5028C3.10876 28.6055 1.91547 23.1141 4.02071 17.3989V17.4014Z"
                fill="#005AFC"
              />
              <path d="M24 8.86767L24.0101 8.82947L34 0L27.0223 12L24 8.86767Z" fill="#F1404B" />
            </svg>
          ) : (
            ''
          )}
        </div>
      )
  }
})

export default UStartupLogo
