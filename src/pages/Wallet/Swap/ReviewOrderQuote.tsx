import React from 'react'
import { ChaingeAggregateQuote } from '@/hooks/chainge/fetchAggregateQuote'
import { formatGasFee, formatPercentage } from '@/utils/formatting'
import TableSection from '@/components/table/TableSection'
import EstimatedCurrencyValue from '@/components/EstimatedCurrencyValue'

interface ReviewOrderProps {
  gasFee: string
  slippage: string
  aggregateQuote: ChaingeAggregateQuote
  networkFee: string
}

const ReviewOrderQuote: React.FC<ReviewOrderProps> = ({ gasFee, slippage, aggregateQuote, networkFee }) => {
  return (
    <TableSection
      reversedColors={true}
      rows={[
        {
          label: 'Provider',
          value: aggregateQuote.aggregator,
        },
        {
          label: `Network fee`,
          value: <EstimatedCurrencyValue formattedCurrencyValue={networkFee} />,
        },
        {
          label: 'Gas fee',
          value: `${formatGasFee(gasFee)} KAS`,
        },
        {
          label: 'Price impact',
          value: formatPercentage(aggregateQuote.priceImpact),
        },
        {
          label: 'Slippage',
          value: formatPercentage(slippage),
        },
      ]}
    />
  )
}

export default ReviewOrderQuote
