import { SelectOption } from '@comunion/components/src/constants'
import { AVAX_USDC_ADDR } from '@/contracts/utils'

export function getBuyCoinAddress(mainCoinAddress: string): Record<number, SelectOption[]> {
  return {
    5: [
      { label: 'GoerliETH', value: mainCoinAddress },
      { label: 'QT13', value: AVAX_USDC_ADDR[5] }
    ],
    97: [
      { label: 'BNB', value: mainCoinAddress },
      { label: 'QCTS', value: AVAX_USDC_ADDR[97] }
    ],
    4002: [
      { label: 'FTM', value: mainCoinAddress },
      { label: 'QCTS', value: AVAX_USDC_ADDR[4002] }
    ],
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
