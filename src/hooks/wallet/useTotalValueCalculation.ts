import { useEffect } from 'react'
import { formatNumberWithDecimal } from '@/utils/formatting'
import useKaspa from '@/hooks/contexts/useKaspa'
import { KaspaToken, Token } from '@/utils/interfaces'

type TotalValueChangeCallback = (value: number) => void

export const useTotalValueCalculation = (
  tokens: (Token | KaspaToken)[],
  price: number,
  onTotalValueChange: TotalValueChangeCallback,
) => {
  const { kaspa } = useKaspa()

  useEffect(() => {
    const kaspaValue = (kaspa.balance ?? 0) * price

    const totalValue = tokens.reduce((acc, token) => {
      const tokenBalance = formatNumberWithDecimal(token.balance, token.dec)
      const tokenValue = (token.floorPrice ?? 0) * tokenBalance
      return acc + tokenValue
    }, kaspaValue)

    onTotalValueChange(totalValue)
  }, [tokens, price, onTotalValueChange])
}
