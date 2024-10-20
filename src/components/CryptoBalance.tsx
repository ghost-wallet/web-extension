import React from 'react'
import { formatBalance, formatBalanceWithAbbreviation } from '@/utils/formatting'

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
  const numericalBalance = tick === 'KASPA' ? parseFloat(balance) : formatBalance(balance, dec)
  const formattedBalance = formatBalanceWithAbbreviation(numericalBalance)

  return (
    <div className="text-primarytext text-center p-2 mt-4">
      <p className="text-lg font-lato">Balance</p>
      <p className="text-xl font-lato">{formattedBalance}</p>
    </div>
  )
}

export default CryptoBalance
