import React, { useState, useEffect } from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import BottomNav from '@/components/navigation/BottomNav'
import TopNav from '@/components/navigation/TopNav'
import NextButton from '@/components/buttons/NextButton'
import PopupMessageDialog from '@/components/messages/PopupMessageDialog'
import { fetchChaingeTokens, ChaingeToken } from '@/hooks/chainge/fetchChaingeTokens'
import { useWalletTokens } from '@/hooks/wallet/useWalletTokens'
import { useLocation } from 'react-router-dom'
import YouPaySection from '@/pages/Wallet/Swap/YouPaySection'
import YouReceiveSection from '@/pages/Wallet/Swap/YouReceiveSection'
import TokenSwitch from '@/pages/Wallet/Swap/TokenSwitch'
import SwapTokenSelect from '@/pages/Wallet/Swap/SwapTokenSelect'
import { AnimatePresence } from 'framer-motion'
import ErrorMessages from '@/utils/constants/errorMessages'
import SwapLoading from '@/pages/Wallet/Swap/SwapLoading'

export default function Swap() {
  const [chaingeTokens, setChaingeTokens] = useState<ChaingeToken[]>([])
  const [payAmount, setPayAmount] = useState('')
  const [receiveAmount, setReceiveAmount] = useState('')
  const { tokens } = useWalletTokens()
  const [showDialog, setShowDialog] = useState(false)
  const [isPayTokenSelectOpen, setIsPayTokenSelectOpen] = useState(false)
  const [isReceiveTokenSelectOpen, setIsReceiveTokenSelectOpen] = useState(false)
  const location = useLocation()
  const { token: locationToken } = location.state || {}
  const [payToken, setPayToken] = useState<ChaingeToken | null>(null)
  const [receiveToken, setReceiveToken] = useState<ChaingeToken | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const fetchedTokens = await fetchChaingeTokens()
        const defaultPayToken = fetchedTokens.find((token) =>
          locationToken ? token.symbol === locationToken.tick : token.symbol === 'KAS',
        )
        const defaultReceiveToken = fetchedTokens.find((token) => token.symbol === 'USDT')
        setChaingeTokens(fetchedTokens)
        setPayToken(defaultPayToken || fetchedTokens[0])
        setReceiveToken(defaultReceiveToken || fetchedTokens[1])
      } catch (err) {
        setError(ErrorMessages.CHAINGE.FAILED_FETCH(err))
      } finally {
        setLoading(false)
      }
    }
    loadTokens()
  }, [locationToken])

  const handlePayAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayAmount(e.target.value)
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
      <TopNav />
      <AnimatedMain className="flex flex-col h-screen w-full fixed">
        <Header title="Swap" showBackButton={true} />
        <div className="flex flex-col h-full justify-between p-4">
          <div>
            {loading ? (
              <SwapLoading />
            ) : (
              <>
                <YouPaySection
                  payAmount={payAmount}
                  payToken={payToken}
                  openTokenSelect={openPayTokenSelect}
                  onAmountChange={handlePayAmountChange}
                  tokens={tokens}
                />
                <TokenSwitch onSwitch={handleSwitch} />
                <YouReceiveSection
                  receiveAmount={receiveAmount}
                  receiveToken={receiveToken}
                  openTokenSelect={openReceiveTokenSelect}
                />
              </>
            )}
          </div>
        </div>
      </AnimatedMain>

      <div className="bottom-20 left-0 right-0 px-4 fixed">
        <NextButton onClick={() => setShowDialog(true)} />
      </div>
      <BottomNav />

      <AnimatePresence>
        {isPayTokenSelectOpen && (
          <SwapTokenSelect
            tokens={chaingeTokens.filter((chaingeToken) => chaingeToken.symbol !== receiveToken?.symbol)}
            onSelectToken={selectToken}
            onClose={closePayTokenSelect}
            loading={loading}
            error={error}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isReceiveTokenSelectOpen && (
          <SwapTokenSelect
            tokens={chaingeTokens.filter((chaingeToken) => chaingeToken.symbol !== payToken?.symbol)}
            onSelectToken={selectReceiveToken}
            onClose={closeReceiveTokenSelect}
            loading={loading}
            error={error}
          />
        )}
      </AnimatePresence>

      <PopupMessageDialog
        title="Not Available"
        message="Swaps are not yet available on Ghost wallet. Follow us for updates."
        onClose={() => setShowDialog(false)}
        isOpen={showDialog}
      />
    </>
  )
}
