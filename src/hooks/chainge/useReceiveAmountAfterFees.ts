import { useState, useEffect } from 'react'
import { ChaingeAggregateQuote } from '@/hooks/chainge/fetchAggregateQuote'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'
import { formatNumberWithDecimal } from '@/utils/formatting'

const useReceiveAmountAfterFees = (
  aggregateQuote: ChaingeAggregateQuote | undefined,
  receiveToken: ChaingeToken | null,
) => {
  const [receiveAmountAfterFees, setReceiveAmountAfterFees] = useState(0)

  useEffect(() => {
    if (aggregateQuote && receiveToken) {
      const calculatedAmount = formatNumberWithDecimal(
        Number(aggregateQuote.outAmount) - Number(aggregateQuote.serviceFee) - Number(aggregateQuote.gasFee),
        receiveToken.decimals,
      )
      setReceiveAmountAfterFees(calculatedAmount)
    } else {
      setReceiveAmountAfterFees(0)
    }
  }, [aggregateQuote, receiveToken])

  return receiveAmountAfterFees
}

export default useReceiveAmountAfterFees
