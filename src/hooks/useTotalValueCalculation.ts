import { useEffect } from 'react'
import { formatBalance } from '@/utils/formatting'
import useKaspa from '@/hooks/useKaspa'

interface Token {
  balance: string
  dec: string
  floorPrice?: number
}

type TotalValueChangeCallback = (value: number) => void

const useTotalValueCalculation = (
  tokens: Token[],
  price: number,
  onTotalValueChange: TotalValueChangeCallback,
) => {
  const { kaspa } = useKaspa()

  useEffect(() => {
    if (tokens.length > 0) {
      const totalValue = tokens.reduce((acc: number, token: Token) => {
        const tokenValue =
          (token.floorPrice ?? 0) *
          parseFloat(formatBalance(token.balance, token.dec))
        return acc + tokenValue
      }, kaspa.balance * price)
      onTotalValueChange(totalValue)
    }
  }, [tokens, kaspa.balance, price, onTotalValueChange])
}

export default useTotalValueCalculation
