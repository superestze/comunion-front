import { hex2rgb } from '@comunion/utils'
import type { GlobalThemeOverrides } from 'naive-ui'
import { NConfigProvider } from 'naive-ui'
import { computed, defineComponent, watchEffect } from 'vue'
import type { ExtractPropTypes } from 'vue'
import '../UTypography/font.css'

export const UStyleProviderProps = {
  // ui 2.0
  primaryColor: {
    type: String,
    default: '#5331F4'
  },
  color1: {
    type: String,
    default: '#000'
  },
  color2: {
    type: String,
    default: 'rgba(0,0,0,.5)'
  },
  color3: {
    type: String,
    default: 'rgba(0,0,0,.3)'
  },
  colorLine: {
    type: String,
    default: 'rgba(0,0,0,.1)'
  },
  colorBorder: {
    type: String,
    default: '#DADCE0'
  },
  colorHover: {
    type: String,
    default: '#F0F0F0'
  },
  // old
  primary1Color: {
    type: String,
    default: '#3F2D99'
  },
  primary2Color: {
    type: String,
    default: '#211B42'
  },
  errorColor: {
    type: String,
    default: '#DF4F51'
  },
  successColor: {
    type: String,
    default: '#1C60F3'
  },
  warningColor: {
    type: String,
    default: '#F29F39'
  },
  infoColor: {
    type: String,
    default: '#6AE0CF'
  },
  grey1Color: {
    type: String,
    default: '#333333'
  },
  grey2Color: {
    type: String,
    default: '#636366'
  },
  grey3Color: {
    type: String,
    default: '#9F9F9F'
  },
  grey4Color: {
    type: String,
    default: '#C0C0C0'
  },
  grey5Color: {
    type: String,
    default: '#E0E0E0'
  },
  green1Color: {
    type: String,
    default: '#219653'
  },
  purpleBg: {
    type: String,
    default: '#F5F6FA'
  },
  purpleLightBg: {
    type: String,
    default: '#D5CFF4'
  },
  purpleGradientBg: {
    type: String,
    default: 'radial-gradient(117.14% 462.2% at 0% 100%, #5331F4 0%, #9783F8 71.69%, #B46AF9 100%)'
  },
  skipLinks: {
    type: String,
    default: '#1672f3'
  }
} as const

export type UStyleProviderPropsType = ExtractPropTypes<typeof UStyleProviderProps>

const UStyleProvider = defineComponent({
  name: 'UStyleProvider',
  props: UStyleProviderProps,
  setup(props, ctx) {
    const style = document.createElement('style')

    document.head.appendChild(style)

    const naiveThemeOverrides = computed<GlobalThemeOverrides>(() => ({
      common: {
        heightLarge: '48px',
        heightMedium: '40px',
        heightSmall: '36px',
        borderRadius: '8px',
        borderRadiusLarge: '8px',
        borderRadiusMedium: '8px',
        borderRadiusSmall: '8px',
        primaryColor: props.primaryColor,
        infoColor: props.infoColor,
        successColor: props.successColor,
        warningColor: props.warningColor,
        errorColor: props.errorColor,
        primaryColorHover: props.primaryColor,
        primaryColorPressed: props.primaryColor,
        successColorHover: props.successColor,
        successColorPressed: props.successColor,
        textColor2: props.grey1Color,
        skipLinks: props.skipLinks
      },
      Form: {
        asteriskColor: props.errorColor
      },
      Button: {
        colorHoverPrimary: props.primaryColor,
        colorPressedPrimary: props.primary1Color,
        colorFocusPrimary: props.primary1Color,
        textColorGhostPrimary: props.primaryColor,
        textColorGhostHoverPrimary: props.primaryColor,
        textColorGhostFocusPrimary: props.primaryColor,
        borderHoverPrimary: props.primaryColor,
        borderFocusPrimary: props.primaryColor
      },
      Pagination: {
        itemBorderHover: props.primaryColor,
        itemTextColorHover: props.primaryColor
      },
      Input: {
        border: `1px solid ${props.grey5Color}`,
        borderFocus: `1px solid ${props.primaryColor}`,
        borderHover: `1px solid ${props.primaryColor}`,
        borderWarning: `1px solid ${props.warningColor}`,
        borderError: `1px solid ${props.errorColor}`,
        borderDisabled: `1px solid ${props.grey5Color}`,
        placeholderColor: props.grey3Color,
        // textColor: props.grey3Color,
        fontSizeLarge: '16px',
        paddingLarge: '16px'
      },
      Scrollbar: {
        color: props.primary1Color,
        colorHover: props.primaryColor
      },
      Checkbox: {
        borderRadius: '2px'
      },
      Card: {
        paddingHuge: '40px',
        borderRadius: '8px',
        borderColor: props.grey5Color
      }
    }))

    watchEffect(() => {
      const { r, g, b } = hex2rgb(props.primaryColor)
      const primary2Color = hex2rgb(props.primary2Color)
      const warningColor = hex2rgb(props.warningColor)
      style.innerHTML = `:root {
        --u-primary-value: ${r}, ${g}, ${b};
        --u-color-1: ${props.color1};
        --u-color-2: ${props.color2};
        --u-color-3: ${props.color3};
        --u-color-line: ${props.colorLine};
        --u-color-border: ${props.colorBorder};
        --u-color-hover: ${props.colorHover};
        --u-primary2-value: ${primary2Color.r},${primary2Color.g},${primary2Color.b};
        --u-primary-color: ${props.primaryColor};
        --u-primary-1-color: ${props.primary1Color};
        --u-primary-2-color: ${props.primary2Color};
        --u-error-color: ${props.errorColor};
        --u-success-color: ${props.successColor};
        --u-warning-color: ${props.warningColor};
        --u-warning2-value: ${warningColor.r},${warningColor.g},${warningColor.b};
        --u-info-color: ${props.infoColor};
        --u-grey-1-color: ${props.grey1Color};
        --u-grey-2-color: ${props.grey2Color};
        --u-grey-3-color: ${props.grey3Color};
        --u-grey-4-color: ${props.grey4Color};
        --u-grey-5-color: ${props.grey5Color};
        --u-green-1-color: ${props.green1Color};
        --u-purple-color: ${props.purpleBg};
        --u-purple-light-color: ${props.purpleLightBg};
        --u-purple-gradient-color: ${props.purpleGradientBg};
        --u-skip-links-color: ${props.skipLinks}
      }`
    })

    return () => (
      <NConfigProvider themeOverrides={naiveThemeOverrides.value}>
        {ctx.slots.default?.()}
      </NConfigProvider>
    )
  }
})

export default UStyleProvider
