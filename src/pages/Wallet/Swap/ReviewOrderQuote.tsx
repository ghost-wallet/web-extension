import React from 'react'
import { ChaingeAggregateQuote } from '@/hooks/chainge/fetchAggregateQuote'
import { formatNumberWithDecimal } from '@/utils/formatting'
import TableSection from '@/components/table/TableSection'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'
import useChaingeTokenData from '@/hooks/chainge/useChaingeTokenData'
import EstimatedCurrencyValue from '@/components/EstimatedCurrencyValue'

interface ReviewOrderProps {
  gasFee: string
  slippage: string
  aggregateQuote: ChaingeAggregateQuote
  receiveToken: ChaingeToken
}

const ReviewOrderQuote: React.FC<ReviewOrderProps> = ({
  gasFee,
  slippage,
  aggregateQuote,
  receiveToken,
}) => {
  const totalFees = formatNumberWithDecimal(
    Number(aggregateQuote.gasFee) + Number(aggregateQuote.serviceFee),
    aggregateQuote.chainDecimal,
  )
  const { formattedCurrencyValue } = useChaingeTokenData(totalFees.toString(), receiveToken, [])

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
          value: <EstimatedCurrencyValue formattedCurrencyValue={formattedCurrencyValue} />,
        },
        {
          label: 'Gas fee',
          value: `${gasFee} KAS`,
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
