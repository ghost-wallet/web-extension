import React from 'react'
import { ChaingeAggregateQuote } from '@/hooks/chainge/fetchAggregateQuote'
import { formatNumberAbbreviated, formatNumberWithDecimal } from '@/utils/formatting'
import TableSection from '@/components/table/TableSection'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'

interface ReviewOrderProps {
  networkFee: string
  slippage: number
  aggregateQuote: ChaingeAggregateQuote
  receiveToken: ChaingeToken
}

const ReviewOrderQuote: React.FC<ReviewOrderProps> = ({
  networkFee,
  slippage,
  aggregateQuote,
  receiveToken,
}) => {
  return (
    <TableSection
      reversedColors={true}
      rows={[
        {
          label: 'Provider',
          value: aggregateQuote.aggregator,
        },
        {
          label: `Chainge fee`,
          value: `${formatNumberAbbreviated(
            formatNumberWithDecimal(
              Number(aggregateQuote.gasFee) + Number(aggregateQuote.serviceFee),
              aggregateQuote.chainDecimal,
            ),
          )} ${receiveToken.symbol}`,
        },
        {
          label: 'Network fee',
          value: `${networkFee} KAS`,
        },
        {
          label: 'Price impact',
          value: `${aggregateQuote.priceImpact}%`,
        },
        {
          label: 'Slippage',
          value: `${slippage}%`,
        },
      ]}
    />
  )
}

export default ReviewOrderQuote
