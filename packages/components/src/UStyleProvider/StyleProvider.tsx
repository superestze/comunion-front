import type { GlobalThemeOverrides } from 'naive-ui'
import { NConfigProvider } from 'naive-ui'
import type { ExtractPropTypes } from 'vue'
import { computed, defineComponent } from 'vue'
import '../UTypography/font.css'

export const UStyleProviderProps = {
  primaryColor: {
    type: String,
    default: '#5331F4'
  },
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
  }
} as const

export type UStyleProviderPropsType = ExtractPropTypes<typeof UStyleProviderProps>

const UStyleProvider = defineComponent({
  name: 'UStyleProvider',
  props: UStyleProviderProps,
  setup(props, ctx) {
    const style = document.createElement('style')
    style.innerHTML = `:root {
      --u-primary-color: ${props.primaryColor};
      --u-primary-1-color: ${props.primary1Color};
      --u-primary-2-color: ${props.primary2Color};
      --u-error-color: ${props.errorColor};
      --u-success-color: ${props.successColor};
      --u-warning-color: ${props.warningColor};
      --u-info-color: ${props.infoColor};
      --u-grey-1-color: ${props.grey1Color};
      --u-grey-2-color: ${props.grey2Color};
      --u-grey-3-color: ${props.grey3Color};
      --u-grey-4-color: ${props.grey4Color};
      --u-grey-5-color: ${props.grey5Color};
      --u-purple-color: ${props.purpleBg};
      --u-purple-light-color: ${props.purpleLightBg};
      --u-purple-gradient-color: ${props.purpleGradientBg};
    }`
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
        successColorPressed: props.successColor
      },
      Form: {
        asteriskColor: props.errorColor
      },
      Button: {
        colorHoverPrimary: props.primary1Color,
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
        textColor: props.grey3Color,
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

    return () => (
      <NConfigProvider themeOverrides={naiveThemeOverrides.value}>
        {ctx.slots.default?.()}
      </NConfigProvider>
    )
  }
})

export default UStyleProvider
