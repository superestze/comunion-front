import { computed } from 'vue'

const mock = { total1: 98, total2: 300, total3: 14000 }

export function useTabs() {
  const { total1, total2, total3 } = mock
  const converset = (numeric: number) => {
    const result = numeric % 10000
    if (result === numeric) {
      return numeric
    }
    return `${(numeric / 10000).toFixed(1)}w`
  }
  console.log(converset(total1), converset(total2), converset(total3))
  const tabs = computed(() => [
    {
      id: '0',
      title: 'STARTUP',
      subTitle: `(${converset(total1)})`
    },
    {
      id: '1',
      title: 'COMER',
      subTitle: `(${converset(total2)})`
    },
    {
      id: '2',
      title: 'CONNECTOR',
      subTitle: `(${converset(total3)})`
    }
  ])
  return {
    tabs
  }
}
