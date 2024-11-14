import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ModalContainer from '@/components/ModalContainer'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'
import useChaingeTokenData from '@/hooks/chainge/useChaingeTokenData'
import ReviewOrderToken from '@/pages/Wallet/Swap/ReviewOrderToken'
import NextButton from '@/components/buttons/NextButton'
import { ChaingeAggregateQuote } from '@/hooks/chainge/fetchAggregateQuote'
import { formatNumberAbbreviated } from '@/utils/formatting'
import ReviewOrderQuote from '@/pages/Wallet/Swap/ReviewOrderQuote'
import useReceiveAmountAfterFees from '@/hooks/chainge/useReceiveAmountAfterFees'
import useKaspa from '@/hooks/contexts/useKaspa'
import ErrorMessage from '@/components/messages/ErrorMessage'

interface ReviewOrderProps {
  payToken: ChaingeToken
  receiveToken: ChaingeToken
  payAmount: string
  slippage: string
  feeRate: number
  networkFee: string
  aggregateQuote: ChaingeAggregateQuote
  onClose: () => void
}

const ReviewOrder: React.FC<ReviewOrderProps> = ({
  payToken,
  receiveToken,
  payAmount,
  slippage,
  feeRate,
  networkFee,
  aggregateQuote,
  onClose,
}) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const receiveAmountAfterFees = useReceiveAmountAfterFees(aggregateQuote, receiveToken)
  const { currencySymbol, formattedCurrencyValue } = useChaingeTokenData(payAmount, payToken, [])
  const { request } = useKaspa()
  const [error, setError] = useState(null)

  const handleSwap = async () => {
    setLoading(true)
    try {
      const order = await request('account:submitChaingeOrder', [
        {
          fromAmount: payAmount,
          fromToken: payToken,
          toToken: receiveToken,
          quote: { ...aggregateQuote, slippage },
          feeRate,
        },
      ])
      // TODO: if order response is not an "error", but clearly not a success either, do not navigate to confirm page. instead set the error here.
      // for example, invalid channel returns:
      // {
      //    code: 3,
      //    data: {}
      //    msg: "invalid channel",
      // }
      // another example:
      // {
      //     "code": 0,
      //     "msg": "success",
      //     "data": {
      //         "status": "Verified",
      //         "timestamp": 0,
      //         "execHash": "",
      //         "reason": "queryAggregateRouter: fail to find chain=KAS",
      //         "amountOut": ""
      //     }
      // }
      navigate('/swap/confirmed', { state: { order } })
    } catch (error: any) {
      setError(error)
      console.error('Error submitting Chainge order:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalContainer title="Review Order" onClose={onClose}>
      <div className="flex-grow overflow-y-auto space-y-2">
        {/* You Pay Section */}
        <ReviewOrderToken
          title="You Pay"
          token={payToken}
          amount={formatNumberAbbreviated(Number(payAmount))}
          estimatedValue={formattedCurrencyValue}
          currencySymbol={currencySymbol}
        />

        {/* You Receive Section */}
        <ReviewOrderToken
          title="You Receive"
          token={receiveToken}
          amount={formatNumberAbbreviated(receiveAmountAfterFees)}
          estimatedValue={aggregateQuote.outAmountUsd}
          currencySymbol={currencySymbol}
        />

        <ReviewOrderQuote
          networkFee={networkFee}
          slippage={slippage}
          aggregateQuote={aggregateQuote}
          receiveToken={receiveToken}
        />
        {error && <ErrorMessage message={error} />}
      </div>
      <div className="pt-4">
        <NextButton text="Swap" onClick={handleSwap} loading={loading} />
      </div>
    </ModalContainer>
  )
}

export default ReviewOrder
