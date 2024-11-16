import React from 'react'
import CryptoImage from '@/components/CryptoImage'
import EstimatedCurrencyValue from '@/components/EstimatedCurrencyValue'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'

interface ReviewOrderTokenProps {
  title: string
  token: ChaingeToken
  amount: string
  estimatedValue: string
  currencySymbol: string
}

const ReviewOrderToken: React.FC<ReviewOrderTokenProps> = ({
  title,
  token,
  amount,
  estimatedValue,
  currencySymbol,
}) => {
  const isCusdt = token?.contractAddress === 'CUSDT'

  return (
    <div className="bg-darkmuted px-4 py-3 rounded-lg mb-1 flex items-center">
      <CryptoImage ticker={isCusdt ? token.contractAddress : token.symbol} size="small" />
      <div className="flex-1 ml-4">
        <div className="flex justify-between items-center">
          <h2 className="text-mutedtext text-base">{title}</h2>
          <span>
            <EstimatedCurrencyValue
              currencySymbol={currencySymbol}
              formattedCurrencyValue={Number(estimatedValue).toFixed(2)}
            />
          </span>
        </div>
        <h2 className="text-primarytext text-2xl font-semibold mt-1">
          {amount} {isCusdt ? token.contractAddress : token.symbol}
        </h2>
      </div>
    </div>
  )
}

export default ReviewOrderToken
