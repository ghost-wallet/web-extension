import React, { useState, useEffect } from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/navigation/BottomNav'
import TopNav from '@/components/navigation/TopNav'
import NextButton from '@/components/buttons/NextButton'
import { ChaingeToken, useChaingeTokens } from '@/hooks/chainge/useChaingeTokens'
import { ChaingeAggregateQuote, fetchAggregateQuote } from '@/hooks/chainge/fetchAggregateQuote'
import { useWalletTokens } from '@/hooks/wallet/useWalletTokens'
import { useLocation } from 'react-router-dom'
import YouPaySection from '@/pages/Wallet/Swap/YouPaySection'
import YouReceiveSection from '@/pages/Wallet/Swap/YouReceiveSection'
import TokenSwitch from '@/pages/Wallet/Swap/TokenSwitch'
import SwapTokenSelect from '@/pages/Wallet/Swap/SwapTokenSelect'
import { AnimatePresence } from 'framer-motion'
import ErrorMessages from '@/utils/constants/errorMessages'
import SwapLoading from '@/pages/Wallet/Swap/SwapLoading'
import { formatNumberAbbreviated, formatNumberWithDecimal } from '@/utils/formatting'
import ErrorButton from '@/components/buttons/ErrorButton'
import ReviewOrder from '@/pages/Wallet/Swap/ReviewOrder'

export default function Swap() {
  const [payAmount, setPayAmount] = useState('')
  const [receiveAmount, setReceiveAmount] = useState('')
  const [aggregateQuote, setAggregateQuote] = useState<ChaingeAggregateQuote | null>(null)
  const [amountError, setAmountError] = useState<string | null>(null)
  const [outAmountUsd, setOutAmountUsd] = useState('')
  const { tokens } = useWalletTokens()
  const [isReviewOrderOpen, setIsReviewOrderOpen] = useState(false)
  const [isPayTokenSelectOpen, setIsPayTokenSelectOpen] = useState(false)
  const [isReceiveTokenSelectOpen, setIsReceiveTokenSelectOpen] = useState(false)
  const location = useLocation()
  const { token: locationToken } = location.state || {}
  const [payToken, setPayToken] = useState<ChaingeToken | null>(null)
  const [receiveToken, setReceiveToken] = useState<ChaingeToken | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Use the query to fetch Chainge tokens
  const { data: chaingeTokens, isLoading, isError, error: queryError } = useChaingeTokens()

  useEffect(() => {
    if (isError) {
      setError(ErrorMessages.CHAINGE.FAILED_FETCH(queryError))
      return
    }

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

  useEffect(() => {
    const formatPayAmount = (amount: number, decimals: number): number => {
      return amount * Math.pow(10, decimals)
    }

    const fetchQuote = async () => {
      if (payToken && receiveToken && payAmount && !isNaN(Number(payAmount))) {
        try {
          const adjustedPayAmount = formatPayAmount(parseFloat(payAmount), payToken.decimals)
          const quote = await fetchAggregateQuote(payToken, receiveToken, adjustedPayAmount)
          setAggregateQuote(quote)
          setReceiveAmount(formatNumberWithDecimal(quote.outAmount, quote.chainDecimal).toString())
          setOutAmountUsd(formatNumberAbbreviated(Number(quote.outAmountUsd)))
        } catch (error) {
          setReceiveAmount('0')
          setOutAmountUsd('0')
          console.error('Error fetching aggregate quote:', error)
        }
      }
    }
    fetchQuote()
  }, [payAmount, payToken, receiveToken])

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
      <TopNav />
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
                <TokenSwitch onSwitch={handleSwitch} />
                <YouReceiveSection
                  receiveAmount={receiveAmount}
                  receiveToken={receiveToken}
                  openTokenSelect={openReceiveTokenSelect}
                  tokens={tokens}
                  outAmountUsd={outAmountUsd}
                />
              </>
            )}
          </div>
        </div>
      </AnimatedMain>

      <div className="bottom-20 left-0 right-0 px-4 fixed">
        {amountError && Number(payAmount) > 0 ? (
          <ErrorButton text="Insufficient Funds" />
        ) : Number(payAmount) > 0 ? (
          <NextButton text="Review Order" onClick={() => setIsReviewOrderOpen(true)} />
        ) : (
          <div />
        )}
      </div>
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
            aggregateQuote={aggregateQuote}
            onClose={() => setIsReviewOrderOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
