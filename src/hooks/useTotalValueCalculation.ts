import { useEffect } from 'react'
import { formatBalance } from '@/utils/formatting'
import useKaspa from '@/hooks/contexts/useKaspa'

interface Token {
  balance: string
  dec: string
  floorPrice?: number
}

type TotalValueChangeCallback = (value: number) => void

export const useTotalValueCalculation = (
  tokens: Token[],
  price: number,
  onTotalValueChange: TotalValueChangeCallback,
) => {
  const { kaspa } = useKaspa()

  useEffect(() => {
    const kaspaValue = (kaspa.balance ?? 0) * price

    const totalValue = tokens.reduce((acc: number, token: Token) => {
      const tokenBalance = formatBalance(token.balance, token.dec)
      const tokenValue = (token.floorPrice ?? 0) * tokenBalance
      return acc + tokenValue
    }, kaspaValue)

    onTotalValueChange(totalValue)
  }, [tokens, kaspa.balance, price, onTotalValueChange])
}
