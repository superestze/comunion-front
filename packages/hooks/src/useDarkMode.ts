import { computed, onMounted, onUnmounted } from 'vue'
import { isMediaDarkMode, setDarkMode, watchMediaDarkMode } from '@comunion/utils'

export type DarkMode = 'dark' | 'light' | 'auto'
export const DarkModeStorageKey = 'app.dark.mode'
/**
 * @param isDarkMode
 * undefined -> system prefers-color-scheme
 *
 * true | false
 */
export default function useDarkMode() {
  const darkMode = computed<DarkMode>({
    get: () => localStorage[DarkModeStorageKey] ?? 'auto',
    set: v => (localStorage[DarkModeStorageKey] = v),
  })

  let unwatch: () => void

  const _useSystemMode = () => {
    setDarkMode(isMediaDarkMode())
    unwatch = watchMediaDarkMode((_isDarkMode: boolean) => {
      setDarkMode(_isDarkMode)
    })
  }

  const _setDarkMode = (mode: DarkMode) => {
    darkMode.value = mode
    if (mode === 'dark') {
      setDarkMode(true)
    } else if (mode === 'light') {
      setDarkMode(false)
    } else {
      _useSystemMode()
    }
  }

  onMounted(() => {
    _setDarkMode(darkMode.value)
  })

  onUnmounted(() => {
    unwatch?.()
  })

  return {
    darkMode,
    setDarkMode: _setDarkMode,
  }
}
