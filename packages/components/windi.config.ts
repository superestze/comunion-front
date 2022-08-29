import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  extract: {
    include: ['**/*.{vue,tsx,css}'],
    exclude: ['node_modules', '.git', 'lib']
  },
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        opensans: ['Open Sans', 'sans-serif']
      },
      colors: {
        primary: 'var(--u-primary-color)',
        primary1: 'var(--u-primary-1-color)',
        primary2: 'var(--u-primary-2-color)',
        error: 'var(--u-error-color)',
        success: 'var(--u-success-color)',
        warning: 'var(--u-warning-color)',
        info: 'var(--u-info-color)',
        grey1: 'var(--u-grey-1-color)',
        grey2: 'var(--u-grey-2-color)',
        grey3: 'var(--u-grey-3-color)',
        grey4: 'var(--u-grey-4-color)',
        grey5: 'var(--u-grey-5-color)',
        green1: 'var(--u-green-1-color)',
        purple: 'var(--u-purple-color)',
        'purple-light': 'var(--u-purple-light-color)',
        'purple-gradient': 'var(--u-purple-gradient-color)'
      },
      backgroundImage: {
        'purple-gradient': 'var(--u-purple-gradient-color)'
      }
    }
  },
  shortcuts: {
    'u-h1': 'font-orbitron font-bold tracking-normal text-[40px] text-grey1 leading-14',
    'u-h2': 'font-orbitron font-bold tracking-normal text-[26px] text-grey1 leading-10',
    'u-h3': 'font-orbitron font-bold tracking-normal text-[20px] text-grey1 leading-8',
    'u-h4': 'font-orbitron font-bold tracking-normal text-[20px] text-grey1 leading-8',
    'u-card-title1': 'font-orbitron font-bold text-[18px] text-grey1 leading-6 tracking-[2px]',
    'u-card-title2': 'font-orbitron font-bold text-[14px] text-grey1 leading-5 tracking-[2px]',
    'u-title1': 'font-opensans font-semibold tracking-normal text-[18px] text-grey1 leading-6',
    'u-title2': 'font-opensans font-semibold tracking-normal text-[16px] text-grey1 leading-5',
    'u-title3': 'font-opensans font-semibold tracking-normal text-[16px] text-grey1 leading-5',
    'u-header1': 'font-opensans font-semibold text-[16px] text-grey1 leading-5 tracking-[2px]',
    'u-label1': 'font-opensans font-semibold text-[16px] text-grey1 leading-5 tracking-[2px]',
    'u-label2': 'font-opensans font-bold text-[14px] text-grey1 leading-5 tracking-[2px]',
    'u-body1': 'font-opensans font-normal tracking-normal text-[16px] text-grey1 leading-5',
    'u-body2': 'font-opensans font-normal tracking-normal text-[14px] text-grey1 leading-5',
    'u-body3': 'font-opensans font-bold tracking-normal text-[16px] text-grey1 leading-5 italic',
    'u-body3-pure': 'font-opensans font-bold tracking-normal text-[16px] leading-5 italic',
    'u-body4': 'font-opensans font-bold tracking-normal text-[16px] text-grey1 leading-5 italic',
    'u-body5': 'font-opensans font-bold tracking-normal text-[16px] text-grey1 leading-5 italic',
    'u-caption': 'font-opensans font-normal tracking-normal text-[14px] text-grey1 leading-5',
    'u-tag': 'font-opensans font-normal tracking-normal text-[12px] text-grey1 leading-4',
    'u-tag2': 'font-opensans font-normal tracking-normal text-[12px] text-grey1 leading-4',
    'u-comeup-card': 'font-opensans font-normal tracking-normal text-[12px] text-grey1 leading-4'
  },
  extend: {
    lineClamp: {
      sm: '3',
      lg: '10'
    }
  },
  plugins: [require('windicss/plugin/line-clamp')]
})
