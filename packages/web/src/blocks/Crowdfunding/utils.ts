import { SelectOption } from '@comunion/components/src/constants'
import { AVAX_USDC_ADDR } from '@/contracts/utils'

export function getBuyCoinAddress(mainCoinAddress: string): Record<number, SelectOption[]> {
  return {
    43113: [
      { label: 'AVAX', value: mainCoinAddress },
      { label: 'USDC', value: AVAX_USDC_ADDR[43113] }
    ],
    43114: [
      { label: 'AVAX', value: mainCoinAddress },
      { label: 'USDC', value: AVAX_USDC_ADDR[43114] }
    ]
  }
}
