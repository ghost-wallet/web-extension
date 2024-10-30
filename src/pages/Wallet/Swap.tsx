import React, { useState, useEffect } from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import { fetchChaingeTokens, ChaingeToken } from '@/hooks/chainge/fetchChaingeTokens'
import SwapTokenSelect from '@/pages/Wallet/Swap/SwapTokenSelect'
import ChaingeTokenDropdown from '@/pages/Wallet/Swap/ChaingeTokenDropdown'
import SwitchChaingeTokens from '@/pages/Wallet/Swap/SwitchChaingeTokens'
import { useLocation } from 'react-router-dom'
import NextButton from '@/components/buttons/NextButton'
import PopupMessageDialog from '@/components/PopupMessageDialog'

export default function Swap() {
  const [tokens, setTokens] = useState<ChaingeToken[]>([])
  const [kaspaAmount, setKaspaAmount] = useState('')
  const [receiveAmount, setReceiveAmount] = useState('')
  const location = useLocation()
  const { token: locationToken } = location.state || {}
  const [payToken, setPayToken] = useState<ChaingeToken | null>(null)
  const [receiveToken, setReceiveToken] = useState<ChaingeToken | null>(null)
  const [isPayTokenSelectOpen, setIsPayTokenSelectOpen] = useState(false)
  const [isReceiveTokenSelectOpen, setIsReceiveTokenSelectOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const fetchedTokens = await fetchChaingeTokens()
        const defaultPayToken = fetchedTokens.find((token) =>
          locationToken ? token.symbol === locationToken.tick : token.symbol === 'KAS',
        )
        const defaultReceiveToken = fetchedTokens.find((token) => token.symbol === 'USDT')

        setTokens(fetchedTokens)
        setPayToken(defaultPayToken || fetchedTokens[0])
        setReceiveToken(defaultReceiveToken || fetchedTokens[1])
        setError(null)
      } catch (err) {
        setError('Error fetching tokens')
      } finally {
        setLoading(false)
      }
    }
    loadTokens()
  }, [locationToken])

  const handleKaspaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKaspaAmount(e.target.value)
  }

  const handleSwitch = () => {
    const tempAmount = kaspaAmount
    setKaspaAmount(receiveAmount)
    setReceiveAmount(tempAmount)

    const tempToken = payToken
    setPayToken(receiveToken)
    setReceiveToken(tempToken)
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

  const showComingSoonDialog = () => setShowDialog(true)

  return (
    <>
      <AnimatedMain>
        <Header title="Swap" showBackButton={true} />
        <div className="flex flex-col justify-between h-screen p-4">
          <div>
            {/* You Pay Section */}
            <div className="bg-darkmuted rounded-lg p-4">
              <h2 className="text-mutedtext text-lg mb-2">You Pay</h2>
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={kaspaAmount}
                  onChange={handleKaspaChange}
                  placeholder="0"
                  className="bg-transparent text-primarytext text-3xl font-semibold w-24"
                />
                <ChaingeTokenDropdown selectedToken={payToken} openTokenSelect={openPayTokenSelect} />
              </div>
              <div className="flex justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-mutedtext">Available: (insert balance)</span>
                </div>
              </div>
            </div>

            <SwitchChaingeTokens onSwitch={handleSwitch} />

            {/* You Receive Section */}
            <div className="bg-darkmuted rounded-lg p-4">
              <h2 className="text-mutedtext text-lg mb-2">You Receive</h2>
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={receiveAmount}
                  placeholder="0"
                  readOnly
                  className="bg-transparent text-primarytext text-3xl font-semibold w-24"
                />
                <ChaingeTokenDropdown selectedToken={receiveToken} openTokenSelect={openReceiveTokenSelect} />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-mutedtext">$0.00</span>
              </div>
            </div>
          </div>

          {/* Next Button aligned at the bottom */}
          <div className="pb-14">
            <NextButton onClick={showComingSoonDialog} text={'Confirm Swap'} />
          </div>
        </div>
      </AnimatedMain>
      <BottomNav />

      <PopupMessageDialog
          message="Swaps are not yet available on Ghost wallet. The team is working round the clock to enable swaps as soon as possible. Follow us on X for updates."
          onClose={() => setShowDialog(false)}
          isOpen={showDialog}
        />

      {isPayTokenSelectOpen && (
        <SwapTokenSelect
          tokens={tokens}
          onSelectToken={selectToken}
          onClose={closePayTokenSelect}
          loading={loading}
          error={error}
        />
      )}

      {isReceiveTokenSelectOpen && (
        <SwapTokenSelect
          tokens={tokens}
          onSelectToken={selectReceiveToken}
          onClose={closeReceiveTokenSelect}
          loading={loading}
          error={error}
        />
      )}
    </>
  )
}
