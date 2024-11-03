import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import { KRC20TokenResponse } from '@/utils/interfaces'
import { formatNumberWithDecimal } from '@/utils/formatting'
import useKaspa from '@/hooks/contexts/useKaspa'
import CryptoImage from '@/components/CryptoImage'
import MintAmountInput from '@/pages/Wallet/Mint/CreateMint/MintAmountInput'
import MintSummary from '@/pages/Wallet/Mint/CreateMint/MintSummary'
import MintRateInfo from '@/pages/Wallet/Mint/CreateMint/MintRateInfo'
import NextButton from '@/components/buttons/NextButton'
import useMintErrorHandling from '@/pages/Wallet/Mint/CreateMint/hooks/useMintErrorHandling'
import useMintValidation from '@/pages/Wallet/Mint/CreateMint/hooks/useMintValidation'
import PopupMessageDialog from '@/components/PopupMessageDialog'
import TopNav from '@/components/TopNav'

export default function CreateMint() {
  const { kaspa } = useKaspa()
  const navigate = useNavigate()
  const location = useLocation()
  const token = location.state?.token as KRC20TokenResponse

  const [mintAmount, setMintAmount] = useState<number | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  const totalMintCost = mintAmount ? formatNumberWithDecimal(token.lim, token.dec) * mintAmount : 0
  const mintRate = formatNumberWithDecimal(token.lim, token.dec)
  const totalSupply = formatNumberWithDecimal(token.max, token.dec)
  const availableSupply = formatNumberWithDecimal(token.max - token.minted, token.dec)

  const { isMintAmountValid } = useMintValidation(mintAmount, totalMintCost, availableSupply, totalSupply)
  const exceedsBalance = mintAmount !== null && mintAmount + kaspa.balance * 0.1 + 25 > kaspa.balance
  const exceedsSupply = mintAmount !== null && totalMintCost > availableSupply
  const error = useMintErrorHandling(
    mintAmount,
    kaspa.balance,
    exceedsBalance,
    exceedsSupply,
    availableSupply,
  )

  const handleNext = () => {
    if (isMintAmountValid && !error) {
      navigate(`/mint/${token.tick}/network-fee`, {
        state: {
          token,
          payAmount: mintAmount,
          receiveAmount: totalMintCost,
        },
      })
    } else {
      setShowDialog(true)
    }
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMintAmount(Number(e.target.value))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      setMintAmount(null)
    } else if (/^\d+$/.test(value) && Number(value) <= 1000) {
      setMintAmount(Number(value))
    }
  }

  return (
    <>
      <TopNav />
      <AnimatedMain className="flex flex-col h-screen fixed w-full">
        <Header title={`Mint ${token.tick}`} showBackButton={true} />
        <div className="flex flex-col flex-grow px-4">
          <CryptoImage ticker={token.tick} size={'large'} />
          <MintAmountInput
            mintAmount={mintAmount}
            onSliderChange={handleSliderChange}
            onInputChange={handleInputChange}
          />
          <MintSummary totalMintCost={totalMintCost} mintAmount={mintAmount} tokenTick={token.tick} />
          <MintRateInfo mintRate={mintRate} tokenTick={token.tick} />
        </div>
      </AnimatedMain>
      <div className="fixed bottom-20 left-0 right-0 px-4">
        <NextButton buttonEnabled={true} onClick={handleNext} />
      </div>
      <BottomNav />
      <PopupMessageDialog
        message={error}
        onClose={() => setShowDialog(false)}
        isOpen={showDialog}
        title="Error"
      />
    </>
  )
}
