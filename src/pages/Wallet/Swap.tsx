import React, { useState, useEffect, useCallback } from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/navigation/BottomNav'
import { ChaingeToken, useChaingeTokens } from '@/hooks/chainge/useChaingeTokens'
import { useWalletTokens } from '@/hooks/wallet/useWalletTokens'
import { useLocation } from 'react-router-dom'
import YouPaySection from '@/pages/Wallet/Swap/YouPaySection'
import YouReceiveSection from '@/pages/Wallet/Swap/YouReceiveSection'
import SwapTokenSelect from '@/pages/Wallet/Swap/SwapTokenSelect'
import { AnimatePresence } from 'framer-motion'
import SwapLoading from '@/pages/Wallet/Swap/SwapLoading'
import ReviewOrder from '@/pages/Wallet/Swap/ReviewOrder'
import useAggregateQuote from '@/hooks/chainge/useAggregateQuote'
import SwitchChaingeTokens from '@/pages/Wallet/Swap/SwitchChaingeTokens'
import ReviewOrderButton from '@/pages/Wallet/Swap/ReviewOrderButton'
import ErrorMessage from '@/components/messages/ErrorMessage'
import TopNavSwap from '@/components/navigation/TopNavSwap'
import SwapGasFeeButton from '@/pages/Wallet/Swap/SwapGasFeeButton'
import SwapGasFeeSelect from '@/pages/Wallet/Swap/SwapGasFeeSelect'
import useKaspa from '@/hooks/contexts/useKaspa'
import ErrorMessages from '@/utils/constants/errorMessages'
import { MINIMUM_KAS_FOR_GAS_FEE } from '@/utils/constants/constants'

export default function Swap() {
  const location = useLocation()
  const { token: locationToken } = location.state || {}
  const { tokens, walletError } = useWalletTokens()
  const { kaspa, request } = useKaspa()
  const [payAmount, setPayAmount] = useState('')
  const [amountError, setAmountError] = useState<string | null>(null)
  const [payToken, setPayToken] = useState<ChaingeToken | null>(null)
  const [receiveToken, setReceiveToken] = useState<ChaingeToken | null>(null)
  const [slippage, setSlippage] = useState<number>(1)
  const [feeRate, setFeeRate] = useState<number>(1)
  const [gasFee, setGasFee] = useState<string>('')
  const [gasFeeError, setGasFeeError] = useState<string | null>(null)
  const [isGasFeeOpen, setIsGasFeeOpen] = useState(false)
  const [isReviewOrderOpen, setIsReviewOrderOpen] = useState(false)
  const [isPayTokenSelectOpen, setIsPayTokenSelectOpen] = useState(false)
  const [isReceiveTokenSelectOpen, setIsReceiveTokenSelectOpen] = useState(false)

  const { data: chaingeTokens, isLoading, isError, error: queryError } = useChaingeTokens()
  const { aggregateQuote, receiveAmount, setReceiveAmount, outAmountUsd, loadingQuote, quoteError } =
    useAggregateQuote(payToken, receiveToken, payAmount)

  const fetchEstimatedFee = useCallback(() => {
    if (!payToken || !payAmount) return
    if (kaspa.balance < MINIMUM_KAS_FOR_GAS_FEE) {
      setGasFeeError(ErrorMessages.NETWORK.INSUFFICIENT_FUNDS(kaspa.balance))
      return
    }

    try {
      request('account:estimateChaingeTransactionFee', [
        {
          fromAmount: payAmount,
          fromToken: payToken,
          feeRate,
        },
      ])
        .then((estimatedFee) => {
          setGasFee(estimatedFee)
          setGasFeeError('')
        })
        .catch((error) => {
          console.error('Error fetching estimated gas fee:', error)
          if (error === 'Storage mass exceeds maximum') {
            setGasFeeError(ErrorMessages.FEES.STORAGE_MASS(payAmount))
          } else {
            setGasFeeError(error)
          }
        })
    } catch (err) {
      console.error('Error in scaling payAmount:', err)
      setGasFeeError('Invalid amount provided')
    }
  }, [payAmount, payToken, feeRate, request])

  useEffect(() => {
    fetchEstimatedFee()
  }, [fetchEstimatedFee])

  useEffect(() => {
    if (chaingeTokens) {
      const defaultPayToken = chaingeTokens.find((token: ChaingeToken) =>
        locationToken ? token.symbol === locationToken.tick : token.symbol === 'KAS',
      )
      const defaultReceiveToken = chaingeTokens.find((token: ChaingeToken) => token.symbol === 'USDT')
      setPayToken(defaultPayToken || chaingeTokens[0])
      setReceiveToken(defaultReceiveToken || chaingeTokens[1])
    }
  }, [chaingeTokens, locationToken, isError, queryError])

  const handlePayAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayAmount(e.target.value)
  }

  const handleAmountErrorChange = (error: string | null) => {
    setAmountError(error)
  }

  const handleSwitch = () => {
    setPayAmount('')
    setReceiveAmount('')
    setPayToken(receiveToken)
    setReceiveToken(payToken)
  }

  const openPayTokenSelect = () => setIsPayTokenSelectOpen(true)
  const openReceiveTokenSelect = () => setIsReceiveTokenSelectOpen(true)
  const closePayTokenSelect = () => setIsPayTokenSelectOpen(false)
  const closeReceiveTokenSelect = () => setIsReceiveTokenSelectOpen(false)

  const selectToken = (token: ChaingeToken) => {
    setPayToken(token)
    closePayTokenSelect()
  }

  const selectReceiveToken = (token: ChaingeToken) => {
    setReceiveToken(token)
    closeReceiveTokenSelect()
  }

  return (
    <>
      <TopNavSwap slippage={slippage} setSlippage={setSlippage} />
      <AnimatedMain className="flex flex-col h-screen w-full fixed">
        <div className="flex flex-col h-full justify-between p-4">
          <div>
            {isLoading || !kaspa.connected ? (
              <SwapLoading />
            ) : (
              <>
                <YouPaySection
                  payAmount={payAmount}
                  payToken={payToken}
                  openTokenSelect={openPayTokenSelect}
                  onAmountChange={handlePayAmountChange}
                  onAmountErrorChange={handleAmountErrorChange}
                  tokens={tokens}
                />
                <SwitchChaingeTokens onSwitch={handleSwitch} />
                <YouReceiveSection
                  receiveAmount={receiveAmount}
                  receiveToken={receiveToken}
                  payAmount={payAmount}
                  openTokenSelect={openReceiveTokenSelect}
                  aggregateQuote={aggregateQuote}
                  loadingQuote={loadingQuote}
                />
                {!quoteError &&
                  !amountError &&
                  !gasFeeError &&
                  payToken &&
                  payAmount &&
                  Number(outAmountUsd) > 1 && (
                    <SwapGasFeeButton setIsGasFeeOpen={setIsGasFeeOpen} gasFee={gasFee} />
                  )}
                {/* TODO: better error display due to fixed container below */}
                {(quoteError || queryError || gasFeeError || walletError) && (
                  <div className="py-4">
                    <ErrorMessage
                      message={quoteError || queryError?.message || gasFeeError || walletError || ''}
                    />
                  </div>
                )}
                {}
              </>
            )}
          </div>
        </div>
      </AnimatedMain>
      <ReviewOrderButton
        amountError={amountError}
        gasFeeError={gasFeeError}
        outAmountUsd={outAmountUsd}
        payAmount={payAmount}
        loadingQuote={loadingQuote}
        setIsReviewOrderOpen={() => setIsReviewOrderOpen(true)}
      />
      <BottomNav />
      <AnimatePresence>
        {isPayTokenSelectOpen && (
          <SwapTokenSelect
            tokens={chaingeTokens?.filter(
              (chaingeToken: ChaingeToken) => chaingeToken.symbol !== receiveToken?.symbol,
            )}
            onSelectToken={selectToken}
            onClose={closePayTokenSelect}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isReceiveTokenSelectOpen && (
          <SwapTokenSelect
            tokens={chaingeTokens?.filter(
              (chaingeToken: ChaingeToken) => chaingeToken.symbol !== payToken?.symbol,
            )}
            onSelectToken={selectReceiveToken}
            onClose={closeReceiveTokenSelect}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isReviewOrderOpen && payToken && receiveToken && aggregateQuote && (
          <ReviewOrder
            payToken={payToken}
            receiveToken={receiveToken}
            payAmount={payAmount}
            slippage={slippage.toString()}
            feeRate={feeRate}
            gasFee={gasFee}
            aggregateQuote={aggregateQuote}
            onClose={() => setIsReviewOrderOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isGasFeeOpen && payToken && payAmount && (
          <SwapGasFeeSelect
            gasFee={gasFee}
            onSelectFeeRate={setFeeRate}
            onClose={() => setIsGasFeeOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
