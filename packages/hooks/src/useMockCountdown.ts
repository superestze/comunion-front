import { onMounted, ref } from 'vue'

export function useMockCountdown(args?: { total: number; speed: 'fast' | 'normal' | 'slow' }) {
  const total = args?.total ?? 100
  const speed = args?.speed ?? 'normal'

  const left = ref(total)

  let timeout: number | undefined

  function loop() {
    timeout = window.setTimeout(() => {
      left.value -= Math.floor(
        (speed === 'fast' ? 1 : speed === 'slow' ? 0.33 : 0.67) * Math.random() * left.value
      )
      loop()
    }, 1000)
  }

  function cancel() {
    if (timeout) {
      window.clearTimeout(timeout)
      timeout = undefined
    }
  }

  onMounted(() => {
    loop()
  })

  return { left, cancel }
}
