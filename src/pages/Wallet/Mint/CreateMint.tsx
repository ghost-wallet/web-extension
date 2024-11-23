import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
import PopupMessageDialog from '@/components/messages/PopupMessageDialog'
import LoadingCreateMint from '@/pages/Wallet/Mint/CreateMint/LoadingCreateMint'
import BottomFixedContainer from '@/components/containers/BottomFixedContainer'

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

  const requiredAmount = mintAmount ? mintAmount + mintAmount * 0.1 + 25 : 0
  const exceedsBalance = mintAmount !== null && requiredAmount > kaspa.balance

  const exceedsSupply = mintAmount !== null && totalMintCost > availableSupply

  const error = useMintErrorHandling(
    mintAmount,
    kaspa.balance,
    kaspa.connected,
    exceedsBalance,
    exceedsSupply,
    availableSupply,
  )

  const handleNext = () => {
    if (isMintAmountValid && !error) {
      navigate(`/mint/${token.tick}/review`, {
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

  return (
    <>
      <AnimatedMain className="flex flex-col h-screen fixed w-full">
        <Header title={`Mint ${token.tick}`} showBackButton={true} />
        {kaspa.connected ? (
          <>
            <div className="flex flex-col flex-grow px-4">
              <CryptoImage ticker={token.tick} size={'large'} />
              <MintAmountInput
                mintAmount={mintAmount}
                onSliderChange={(e) => setMintAmount(Number(e.target.value))}
                onInputChange={(e) => setMintAmount(e.target.value === '' ? null : Number(e.target.value))}
              />
              <MintSummary totalMintCost={totalMintCost} mintAmount={mintAmount} tokenTick={token.tick} />
              <MintRateInfo mintRate={mintRate} tokenTick={token.tick} />
            </div>
          </>
        ) : (
          <LoadingCreateMint />
        )}
      </AnimatedMain>
      {kaspa.connected && (
        <BottomFixedContainer className="p-4 bg-bgdark border-t border-darkmuted ">
          <NextButton buttonEnabled={true} onClick={handleNext} text="Review Mint" />
        </BottomFixedContainer>
      )}
      <PopupMessageDialog
        message={error}
        onClose={() => setShowDialog(false)}
        isOpen={showDialog}
        title="Error"
      />
    </>
  )
}
