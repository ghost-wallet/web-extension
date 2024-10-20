import React from 'react'
import { formatBalance } from '@/utils/formatting'

interface Token {
  tick: string
  balance: string
  dec: string
}

interface CryptoBalanceProps {
  token: Token
}

const CryptoBalance: React.FC<CryptoBalanceProps> = ({ token }) => {
  const { tick, balance, dec } = token
  const formattedBalance =
    tick === 'KASPA'
      ? parseFloat(balance).toLocaleString()
      : parseFloat(formatBalance(balance, dec)).toLocaleString()

  return (
    <div className="text-primarytext text-center p-2 mt-4">
      <p className="text-lg font-lato">Balance</p>
      <p className="text-xl font-lato">{formattedBalance}</p>
    </div>
  )
}

export default CryptoBalance
