import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import { formatNumberWithAbbreviation } from '@/utils/formatting'
import { KRC20TokenResponse } from '@/utils/interfaces'
import useKaspa from '@/hooks/contexts/useKaspa'
import CryptoImage from '@/components/CryptoImage'
import SpinnerPage from '@/components/SpinnerPage'

export default function ConfirmMint() {
  const location = useLocation()
  const navigate = useNavigate()
  const { request } = useKaspa()
  const token = location.state?.token as KRC20TokenResponse
  const payAmount = location.state?.payAmount as number
  const receiveAmount = location.state?.receiveAmount as number
  const feeRate = location.state?.feeRate as number
  const networkFee = location.state?.networkFee as number
  const serviceFee = payAmount * 0.1
  const [isMinting, setIsMinting] = useState(false)

  const handleMint = async () => {
    setIsMinting(true)
    try {
      const transactionIds = await request('account:doKRC20Mint', [token.tick, feeRate, payAmount])
      console.log('Minted txn ids:', transactionIds)
      navigate(`/mint/${token.tick}/network-fee/review/minted`, {
        state: { token, receiveAmount, transactionIds },
      })
    } catch (error) {
      console.error('Error during minting:', error)
    } finally {
      setIsMinting(false)
    }
  }

  if (isMinting) {
    return <SpinnerPage displayText={`Minting ${receiveAmount.toLocaleString()} ${token.tick}...`} />
  }

  return (
    <>
      <AnimatedMain>
        <Header title="Confirm Mint" showBackButton={true} />
        <div className="px-6">
          <CryptoImage ticker={token.tick} size="large" />
          <div className="w-full max-w-md space-y-1 pt-2">
            <div className="flex justify-between mt-10">
              <span className="text-mutedtext font-lato text-base">Receive amount</span>
              <span className="text-mutedtext font-lato text-base">
                {receiveAmount.toLocaleString()} {token.tick}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-mutedtext font-lato text-base">Mint cost</span>
              <span className="text-mutedtext font-lato text-base">{payAmount?.toLocaleString()} KAS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mutedtext font-lato text-base">Network fee</span>
              <span className="text-mutedtext font-lato text-base">
                {networkFee ? `${networkFee} KAS` : 'Calculating...'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-mutedtext font-lato text-base">Service fee</span>
              <span className="text-mutedtext font-lato text-base">{serviceFee.toFixed(1)} KAS</span>
            </div>
            <div className="flex justify-between pt-8">
              <span className="text-mutedtext font-lato text-xl">Total</span>
              <span className="text-primarytext font-lato text-xl">
                {payAmount + serviceFee + networkFee} KAS
              </span>
            </div>
          </div>
        </div>
        <div className="px-4 pt-16">
          <button
            onClick={handleMint}
            className="w-full h-[52px] text-lg font-lato font-semibold rounded-[25px] bg-primary text-secondarytext cursor-pointer hover:bg-hover"
          >
            {`Mint ${formatNumberWithAbbreviation(receiveAmount)} ${token.tick}`}
          </button>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
