import React from 'react'
import { ChaingeAggregateQuote } from '@/hooks/chainge/fetchAggregateQuote'
import { formatNumberAbbreviated, formatNumberWithDecimal } from '@/utils/formatting'
import TableSection from '@/components/table/TableSection'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'

interface ReviewOrderProps {
  aggregateQuote: ChaingeAggregateQuote
  receiveToken: ChaingeToken
}

const ReviewOrderQuote: React.FC<ReviewOrderProps> = ({ aggregateQuote, receiveToken }) => {
  return (
    <TableSection
      reversedColors={true}
      rows={[
        {
          label: 'Provider',
          value: aggregateQuote.aggregator,
        },
        {
          label: 'Network fee',
          value: `${formatNumberAbbreviated(
            formatNumberWithDecimal(aggregateQuote.gasFee, receiveToken.decimals),
          )} ${receiveToken.symbol}`,
        },
        {
          label: 'Service fee',
          value: `${formatNumberAbbreviated(
            formatNumberWithDecimal(aggregateQuote.serviceFee, receiveToken.decimals),
          )} ${receiveToken.symbol}`,
        },
        {
          label: 'Price impact',
          value: `${aggregateQuote.priceImpact} %`,
        },
        {
          label: 'Slippage',
          value: `${aggregateQuote.slippage} %`,
        },
      ]}
    />
  )
}

export default ReviewOrderQuote
