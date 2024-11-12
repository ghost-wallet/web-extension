import React from 'react'
import CryptoImage from '@/components/CryptoImage'
import EstimatedCurrencyValue from '@/components/EstimatedCurrencyValue'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'
import { formatNumberAbbreviated } from '@/utils/formatting'

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
}) => (
  <div className="bg-darkmuted p-4 rounded-lg mb-1 flex items-center">
    <CryptoImage ticker={token.symbol} size="small" />
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
        {formatNumberAbbreviated(Number(amount))} {token.symbol}
      </h2>
    </div>
  </div>
)

export default ReviewOrderToken
