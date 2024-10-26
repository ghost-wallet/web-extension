import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import { Krc20TokenInfo } from '@/hooks/kasplex/fetchKrc20TokenInfo'
import { formatBalance } from '@/utils/formatting'
import useKaspa from '@/hooks/contexts/useKaspa'
import ErrorMessage from '@/components/ErrorMessage'
import CryptoImage from '@/components/cryptos/CryptoImage'

export default function CreateMint() {
  const navigate = useNavigate()
  const { kaspa } = useKaspa()
  const location = useLocation()
  const token = location.state?.token as Krc20TokenInfo

  const [mintAmount, setMintAmount] = useState<number | null>(null)
  const [error, setError] = useState<string>('')

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMintAmount(Number(e.target.value))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      setMintAmount(null)
    } else if (/^\d+$/.test(value) && Number(value) <= 10000) {
      setMintAmount(Number(value))
    }
  }

  const totalMintCost = mintAmount
    ? (parseFloat(String(formatBalance(token.lim, token.dec))) * mintAmount).toLocaleString()
    : '0'

  const isMintAmountValid = mintAmount !== null && mintAmount >= 1 && mintAmount <= 10000
  const exceedsBalance = mintAmount !== null && mintAmount > kaspa.balance
  const showError = exceedsBalance

  useEffect(() => {
    if (exceedsBalance) {
      setError(`${mintAmount} exceeds your available balance: ${kaspa.balance} KAS`)
    } else {
      setError('')
    }
  }, [mintAmount, kaspa.balance, exceedsBalance])

  const handleReview = () => {
    if (isMintAmountValid && !showError) {
      navigate(`/mint/${token.tick}/review`, {
        state: {
          token,
          payAmount: mintAmount,
          receiveAmount: totalMintCost,
        },
      })
    }
  }

  return (
    <>
      <AnimatedMain>
        <Header title={`Mint ${token.tick}`} showBackButton={true} />
        <div className="px-4">
          <CryptoImage ticker={token.tick} size={'large'} />
          <div className="flex items-center space-x-4 pt-4">
            <input
              type="range"
              min="0"
              max="10000"
              value={mintAmount || 0}
              onChange={handleSliderChange}
              className="w-full cursor-pointer accent-primary h-2"
            />
            <input
              type="number"
              min="0"
              max="10000"
              value={mintAmount !== null ? mintAmount : ''}
              onChange={handleInputChange}
              className="w-26 bg-darkmuted p-2 border border-muted rounded-lg font-lato text-base text-primarytext text-center"
              placeholder="KAS"
            />
          </div>
          <div className="w-full max-w-md space-y-2 mt-6">
            <div className="flex justify-between">
              <span className="text-mutedtext font-lato text-base">You Receive</span>
              <span className="text-primarytext font-lato text-base">
                {totalMintCost} {token.tick}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-mutedtext font-lato text-base">Mint Cost</span>
              <span className="text-primarytext font-lato text-base">
                {mintAmount?.toLocaleString() || '0'} KAS
              </span>
            </div>
          </div>
          <div className="rounded-base text-mutedtext text-base font-lato text-center mt-4">
            Mint rate: {formatBalance(token.lim, token.dec).toLocaleString()} {token.tick} per 1 KAS
          </div>
        </div>
        {showError && (
          <div className="px-4 mt-4">
            <ErrorMessage message={error} />
          </div>
        )}
        <div className="px-4 py-4">
          <button
            onClick={handleReview}
            disabled={!isMintAmountValid || showError}
            className={`w-full h-[52px] text-lg font-lato font-semibold rounded-[25px] ${
              isMintAmountValid && !showError
                ? 'bg-primary text-secondarytext cursor-pointer hover:bg-hover'
                : 'bg-muted text-mutedtext cursor-not-allowed'
            }`}
          >
            Review Mint
          </button>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
