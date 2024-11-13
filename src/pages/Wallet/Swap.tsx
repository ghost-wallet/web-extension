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
import SwapNetworkFeeButton from '@/pages/Wallet/Swap/SwapNetworkFeeButton'
import SwapNetworkFeeSelect from '@/pages/Wallet/Swap/SwapNetworkFeeSelect'
import useKaspa from '@/hooks/contexts/useKaspa'

export default function Swap() {
  const location = useLocation()
  const { token: locationToken } = location.state || {}
  const { tokens } = useWalletTokens()
  const { request } = useKaspa()
  const [payAmount, setPayAmount] = useState('')
  const [amountError, setAmountError] = useState<string | null>(null)
  const [payToken, setPayToken] = useState<ChaingeToken | null>(null)
  const [receiveToken, setReceiveToken] = useState<ChaingeToken | null>(null)
  const [slippage, setSlippage] = useState<number>(1)
  const [feeRate, setFeeRate] = useState<number>(1)
  const [networkFee, setNetworkFee] = useState<string>('')
  const [isNetworkFeeOpen, setIsNetworkFeeOpen] = useState(false)
  const [isReviewOrderOpen, setIsReviewOrderOpen] = useState(false)
  const [isPayTokenSelectOpen, setIsPayTokenSelectOpen] = useState(false)
  const [isReceiveTokenSelectOpen, setIsReceiveTokenSelectOpen] = useState(false)

  const { data: chaingeTokens, isLoading, isError, error: queryError } = useChaingeTokens()
  const { aggregateQuote, receiveAmount, setReceiveAmount, outAmountUsd, loadingQuote, error } =
    useAggregateQuote(payToken, receiveToken, payAmount)

  const fetchEstimatedFee = useCallback(() => {
    if (!payToken || !payAmount) return
    request('account:estimateChaingeTransactionFee', [
      {
        fromAmount: payAmount,
        fromToken: payToken,
        feeRate,
      },
    ])
      .then((estimatedFee) => {
        console.log('Estimated network fee:', estimatedFee)
        setNetworkFee(estimatedFee)
      })
      .catch((error) => {
        console.error('Error fetching estimated network fee:', error)
      })
  }, [payAmount, payToken, feeRate, request])

  useEffect(() => {
    fetchEstimatedFee()
  }, [fetchEstimatedFee])

  useEffect(() => {
    // TODO: handle error if there are no chainge tokens
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
    setPayAmount(receiveAmount)
    setReceiveAmount(payAmount)
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
            {isLoading ? (
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
                  tokens={tokens}
                  aggregateQuote={aggregateQuote}
                  loadingQuote={loadingQuote}
                />
                {!error && !amountError && payToken && payAmount && Number(outAmountUsd) > 1 && (
                  <SwapNetworkFeeButton setIsNetworkFeeOpen={setIsNetworkFeeOpen} networkFee={networkFee} />
                )}
                {error && (
                  <div className="py-4">
                    {' '}
                    <ErrorMessage message={error} />{' '}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </AnimatedMain>
      <ReviewOrderButton
        amountError={amountError}
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
            slippage={slippage}
            networkFee={networkFee}
            aggregateQuote={aggregateQuote}
            onClose={() => setIsReviewOrderOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isNetworkFeeOpen && payToken && payAmount && (
          <SwapNetworkFeeSelect
            networkFee={networkFee}
            onSelectFeeRate={setFeeRate}
            onClose={() => setIsNetworkFeeOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
