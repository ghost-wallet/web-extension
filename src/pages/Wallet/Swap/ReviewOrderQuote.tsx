import React from 'react'
import { ChaingeAggregateQuote } from '@/hooks/chainge/fetchAggregateQuote'
import { formatNumberAbbreviated, formatNumberWithDecimal } from '@/utils/formatting'
import TableSection from '@/components/table/TableSection'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'

interface ReviewOrderProps {
  slippage: number
  aggregateQuote: ChaingeAggregateQuote
  receiveToken: ChaingeToken
}

const ReviewOrderQuote: React.FC<ReviewOrderProps> = ({ slippage, aggregateQuote, receiveToken }) => {
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
              receiveToken.decimals,
            ),
          )} ${receiveToken.symbol}`,
        },
        {
          label: 'Network fee',
          value: '0.001 KAS', //TODO give option to select network fee
        },
        {
          label: 'Price impact',
          value: `${aggregateQuote.priceImpact} %`,
        },
        {
          label: 'Slippage',
          value: `${slippage} %`,
        },
      ]}
    />
  )
}

export default ReviewOrderQuote
