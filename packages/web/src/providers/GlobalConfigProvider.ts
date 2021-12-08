import type { InjectionKey } from 'vue'
import { readonly } from 'vue'
import { inject } from 'vue'
import { provide, reactive } from 'vue'
import { defineComponent } from 'vue'

export interface GlobalConfigState {
  // current theme, default: light
  theme: string
}

export const GlobalConfigSymbol: InjectionKey<GlobalConfigState> = Symbol()

export const GlobalConfigProvider = defineComponent({
  name: 'GlobalConfigProvider',
  setup(props, ctx) {
    const state = reactive<GlobalConfigState>({
      theme: 'light'
    })
    provide(GlobalConfigSymbol, readonly(state))
    return () => ctx.slots.default?.()
  }
})

export function useGlobalConfig(): GlobalConfigState {
  const state = inject(GlobalConfigSymbol)
  if (!state) {
    throw new Error('useGlobalConfig should be used inside GlobalConfigProvider.')
  }
  return state
}
