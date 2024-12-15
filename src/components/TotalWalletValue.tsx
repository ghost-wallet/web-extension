import React from 'react'
import { formatNumberAbbreviated } from '@/utils/formatting'
import useKaspa from '@/hooks/contexts/useKaspa'

interface TotalValueProps {
  totalValue: number
}

const TotalWalletValue: React.FC<TotalValueProps> = ({ totalValue }) => {
  const formattedCurrencyValue = formatNumberAbbreviated(totalValue, true)

  const { kaspa } = useKaspa()

  return (
    <>
      {kaspa.balanceValid ? (
        <h1 className="text-primarytext font-rubik text-center flex-grow text-4xl py-4">
          {formattedCurrencyValue}
        </h1>
      ) : (
        <span className="text-primarytext font-rubix text-center flex-grow text-4xl py-4">
          Tokens loading...
        </span>
      )}
    </>
  )
}

export default TotalWalletValue
