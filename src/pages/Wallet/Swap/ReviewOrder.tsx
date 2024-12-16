import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ModalContainer from '@/components/containers/ModalContainer'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'
import useChaingeTokenData from '@/hooks/chainge/useChaingeTokenData'
import ReviewOrderToken from '@/pages/Wallet/Swap/ReviewOrderToken'
import NextButton from '@/components/buttons/NextButton'
import { ChaingeAggregateQuote } from '@/hooks/chainge/fetchAggregateQuote'
import {
  formatNumberAbbreviated,
  formatNumberWithDecimal,
  formatPercentage,
  formatUsd,
} from '@/utils/formatting'
import ReviewOrderQuote from '@/pages/Wallet/Swap/ReviewOrderQuote'
import useReceiveAmountAfterFees from '@/hooks/chainge/useReceiveAmountAfterFees'
import useKaspa from '@/hooks/contexts/useKaspa'
import ErrorMessage from '@/components/messages/ErrorMessage'
import WarningMessage from '@/components/WarningMessage'
import { WarningMessages } from '@/utils/constants/warningMessages'
import BottomFixedContainer from '@/components/containers/BottomFixedContainer'
import PopupMessageDialog from '@/components/messages/PopupMessageDialog'
import useChainge from '@/hooks/contexts/useChainge'
import { getChaingeTicker } from '@/utils/labels'

interface ReviewOrderProps {
  payToken: ChaingeToken
  receiveToken: ChaingeToken
  payAmount: string
  slippage: string
  feeRate: number
  gasFee: string
  aggregateQuote: ChaingeAggregateQuote
  onClose: () => void
}

const ReviewOrder: React.FC<ReviewOrderProps> = ({
  payToken,
  receiveToken,
  payAmount,
  slippage,
  feeRate,
  gasFee,
  aggregateQuote,
  onClose,
}) => {
  const navigate = useNavigate()
  const { kaspa, request } = useKaspa()
  const receiveAmountAfterFees = useReceiveAmountAfterFees(aggregateQuote, receiveToken)
  const { formattedCurrencyValue, currencyValue } = useChaingeTokenData(payAmount, payToken, [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [warning, setWarning] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const { addOrder } = useChainge()

  const totalNetworkFees = formatNumberWithDecimal(
    Number(aggregateQuote.gasFee) + Number(aggregateQuote.serviceFee),
    aggregateQuote.chainDecimal,
  )
  const { formattedCurrencyValue: formattedNetworkFee } = useChaingeTokenData(
    totalNetworkFees.toString(),
    receiveToken,
    [],
  )

  // TODO convert USD to local settings currency
  const formattedOutAmountUsd = formatUsd(Number(aggregateQuote?.outAmountUsd))

  useEffect(() => {
    const outAmountUsd = Number(aggregateQuote.outAmountUsd)

    if (outAmountUsd < currencyValue * 0.93) {
      // if more than 5% loss on trade
      const difference = currencyValue - outAmountUsd
      const percentageLoss = ((difference / currencyValue) * 100).toFixed(2)
      const formattedPercentageLoss = formatPercentage(percentageLoss)
      const formattedDifference = formatUsd(difference)
      const formattedPriceImpact = formatPercentage(aggregateQuote.priceImpact)
      setWarning(
        WarningMessages.LOW_LIQUIDITY(formattedDifference, formattedPercentageLoss, formattedPriceImpact),
      )
    } else {
      setWarning(null)
    }
  }, [aggregateQuote.outAmountUsd, currencyValue])

  const handleSwap = async () => {
    setLoading(true)
    try {
      const postChaingeOrderRequest = {
        walletAddress: kaspa.addresses[0],
        payTokenTicker: payToken.contractAddress == 'CUSDT' ? 'CUSDT' : payToken.symbol,
        payAmount: Number(payAmount),
        receiveTokenTicker: receiveToken.contractAddress == 'CUSDT' ? 'CUSDT' : receiveToken.symbol,
        receiveAmount: receiveAmountAfterFees,
        receiveAmountUsd: Number(aggregateQuote.outAmountUsd),
        slippage,
        priceImpact: aggregateQuote.priceImpact,
        gasFee: Number(gasFee),
        serviceFeeUsd: parseFloat(formattedNetworkFee.replace('$', '')),
      }
      const order = await request('account:submitChaingeOrder', [
        {
          fromAmount: payAmount,
          fromToken: payToken,
          toToken: receiveToken,
          quote: { ...aggregateQuote, slippage },
          feeRate,
          postChaingeOrderRequest,
        },
      ])

      if (order?.data?.id) {
        const newOrder = {
          orderId: order.data.id,
          payTokenTicker: getChaingeTicker(payToken),
          receiveTokenTicker: getChaingeTicker(receiveToken),
        }
        addOrder(newOrder)
      }

      navigate('/swap/confirmed', { state: { order, receiveToken } })
    } catch (error: any) {
      setError(`Error submitting swap order to Chainge: ${JSON.stringify(error)}`)
      setShowDialog(true)
      console.error('Error submitting Chainge order:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ModalContainer title="Review Order" onClose={onClose}>
        <div className="flex-grow overflow-y-auto space-y-2 pb-20">
          {/* You Pay Section */}
          <ReviewOrderToken
            title="You Pay"
            token={payToken}
            amount={formatNumberAbbreviated(Number(payAmount))}
            formattedCurrencyValue={formattedCurrencyValue}
          />

          {/* You Receive Section */}
          <ReviewOrderToken
            title="You Receive"
            token={receiveToken}
            amount={formatNumberAbbreviated(receiveAmountAfterFees)}
            formattedCurrencyValue={formattedOutAmountUsd}
          />

          {warning && <WarningMessage message={warning} />}

          <ReviewOrderQuote
            gasFee={gasFee}
            slippage={slippage}
            aggregateQuote={aggregateQuote}
            networkFee={formattedNetworkFee}
          />
          {error && <ErrorMessage message={error} />}
        </div>
        <BottomFixedContainer className="p-4 bg-bgdark border-t border-darkmuted ">
          <NextButton text="Swap" onClick={handleSwap} loading={loading} />
        </BottomFixedContainer>
      </ModalContainer>
      <PopupMessageDialog
        message={error}
        onClose={() => setShowDialog(false)}
        isOpen={showDialog}
        title="Error"
      />
    </>
  )
}

export default ReviewOrder
