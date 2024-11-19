import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ModalContainer from '@/components/containers/ModalContainer'
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
import WarningMessage from '@/components/WarningMessage'
import { WarningMessages } from '@/utils/constants/warningMessages'
import BottomFixedContainer from '@/components/containers/BottomFixedContainer'
import PopupMessageDialog from '@/components/messages/PopupMessageDialog'
import useSettings from '@/hooks/contexts/useSettings'

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
  const navigate = useNavigate()
  const { request } = useKaspa()
  const { settings } = useSettings()
  const receiveAmountAfterFees = useReceiveAmountAfterFees(aggregateQuote, receiveToken)
  const { formattedCurrencyValue } = useChaingeTokenData(payAmount, payToken, [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [warning, setWarning] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  const formattedOutAmountUsd = Number(aggregateQuote?.outAmountUsd).toLocaleString(undefined, {
    style: 'currency',
    currency: settings.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  useEffect(() => {
    const outAmountUsd = Number(aggregateQuote.outAmountUsd)
    const formattedValue = Number(formattedCurrencyValue.replace(/[^0-9.-]+/g, ''))

    if (outAmountUsd < formattedValue * 0.9) {
      const difference = formattedValue - outAmountUsd
      const percentageLoss = ((difference / formattedValue) * 100).toFixed(2)
      setWarning(WarningMessages.LOW_LIQUIDITY(difference, percentageLoss))
    } else {
      setWarning(null)
    }
  }, [aggregateQuote.outAmountUsd, formattedCurrencyValue])

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
            networkFee={networkFee}
            slippage={slippage}
            aggregateQuote={aggregateQuote}
            receiveToken={receiveToken}
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
