import React from 'react'
import { formatNumberAbbreviated } from '@/utils/formatting'
import useKaspa from '@/hooks/contexts/useKaspa'
import LoadingPlaceholder from '@/components/animations/LoadingPlaceholder'

interface TotalValueProps {
  totalValue: number
}

const TotalWalletValue: React.FC<TotalValueProps> = ({ totalValue }) => {
  const formattedCurrencyValue = formatNumberAbbreviated(totalValue, true)

  const { kaspa } = useKaspa()

  return (
    <>
      <h1 className="text-primarytext text-center w-2/3 font-rubik flex-grow text-4xl py-4 flex justify-center">
        {kaspa.balanceValid ? (
          <> {formattedCurrencyValue} </>
        ) : (
          <LoadingPlaceholder className="flex-grow font-rubik py-4 h-10 max-h-10 w-2/3" />
        )}
      </h1>
    </>
  )
}

export default TotalWalletValue
