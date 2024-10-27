import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import { KRC20TokenResponse } from '@/utils/interfaces'
import { formatNumberWithDecimal } from '@/utils/formatting'
import useKaspa from '@/hooks/contexts/useKaspa'
import ErrorMessage from '@/components/ErrorMessage'
import CryptoImage from '@/components/cryptos/CryptoImage'
import MintAmountInput from '@/pages/Wallet/Mint/CreateMint/MintAmountInput'
import MintSummary from '@/pages/Wallet/Mint/CreateMint/MintSummary'
import MintRateInfo from '@/pages/Wallet/Mint/CreateMint/MintRateInfo'
import ReviewMintButton from '@/pages/Wallet/Mint/CreateMint/ReviewMintButton'
import useMintErrorHandling from '@/pages/Wallet/Mint/CreateMint/hooks/useMintErrorHandling'
import useMintValidation from '@/pages/Wallet/Mint/CreateMint/hooks/useMintValidation'

export default function CreateMint() {
  const { kaspa } = useKaspa()
  const navigate = useNavigate()
  const location = useLocation()
  const token = location.state?.token as KRC20TokenResponse

  const [mintAmount, setMintAmount] = useState<number | null>(null)
  const totalMintCost = mintAmount ? formatNumberWithDecimal(token.lim, token.dec) * mintAmount : 0

  const mintRate = formatNumberWithDecimal(token.lim, token.dec)
  const totalSupply = formatNumberWithDecimal(token.max, token.dec)
  const availableSupply = formatNumberWithDecimal(token.max - token.minted, token.dec)

  const { isMintAmountValid } = useMintValidation(mintAmount, totalMintCost, availableSupply, totalSupply)
  const exceedsBalance = mintAmount !== null && mintAmount > kaspa.balance
  const exceedsSupply = mintAmount !== null && totalMintCost > availableSupply
  const error = useMintErrorHandling(
    mintAmount,
    kaspa.balance,
    exceedsBalance,
    exceedsSupply,
    availableSupply,
  )
  const showError = !!error

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

  return (
    <>
      <AnimatedMain>
        <Header title={`Mint ${token.tick}`} showBackButton={true} />
        <div className="px-4">
          <CryptoImage ticker={token.tick} size={'large'} />
          <MintAmountInput
            mintAmount={mintAmount}
            onSliderChange={handleSliderChange}
            onInputChange={handleInputChange}
          />
          <MintSummary totalMintCost={totalMintCost} mintAmount={mintAmount} tokenTick={token.tick} />
          <MintRateInfo mintRate={mintRate} tokenTick={token.tick} />
        </div>
        <div className="px-4 mt-4" style={{ height: '24px' }}>
          {showError && <ErrorMessage message={error} />}
        </div>
        <div className="px-4 pt-16">
          <ReviewMintButton
            isMintAmountValid={isMintAmountValid}
            showError={showError}
            onClick={handleReview}
          />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
