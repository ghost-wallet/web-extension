import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BottomNav from '@/components/navigation/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import { KRC20TokenResponse } from '@/utils/interfaces'
import useKaspa from '@/hooks/contexts/useKaspa'
import CryptoImage from '@/components/CryptoImage'
import SpinnerPage from '@/components/loaders/SpinnerPage'
import NextButton from '@/components/buttons/NextButton'
import TotalCostToMint from '@/pages/Wallet/Mint/TotalCostToMint'
import { useQueryClient } from '@tanstack/react-query'
import TopNav from '@/components/navigation/TopNav'

export default function ConfirmMint() {
  const location = useLocation()
  const navigate = useNavigate()
  const { request } = useKaspa()
  const { token, payAmount, receiveAmount, feeRate, networkFee, serviceFee, totalFees } = location.state as {
    token: KRC20TokenResponse
    payAmount: number
    receiveAmount: number
    feeRate: number
    networkFee: string
    serviceFee: string
    totalFees: string
  }
  const [isMinting, setIsMinting] = useState(false)

  const queryClient = useQueryClient()

  const handleMint = async () => {
    setIsMinting(true)
    queryClient.invalidateQueries({ queryKey: ['krc20Tokens'] })
    try {
      const transactionIds = await request('account:doKRC20Mint', [token.tick, feeRate, payAmount])
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
    return (
      <SpinnerPage
        displayText={`Minting ${receiveAmount.toLocaleString()} ${
          token.tick
        }. Do not close your web browser or log out, else
        minting will stop and you'll permanently lose any unminted KAS. You can close your Ghost extension and 
        it'll keep minting in the background. 
        Every 1 KAS = 1 mint = 1 transaction, which means this could take a while. Feel free to close and re-open your
        extension to check minting progress on the KRC20 transactions page.`}
      />
    )
  }

  return (
    <>
      <TopNav />
      <AnimatedMain className="flex flex-col h-screen fixed w-full">
        <Header title="Confirm Mint" showBackButton={true} />
        <div className="flex flex-col px-4">
          <CryptoImage ticker={token.tick} size="large" />
          <div className="w-full space-y-1 pt-2">
            <div className="flex justify-between">
              <span className="text-mutedtext text-base">Receive amount</span>
              <span className="text-mutedtext text-base text-right">
                {receiveAmount.toLocaleString()} {token.tick}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-mutedtext text-base">Mint cost</span>
              <span className="text-mutedtext text-base text-right">{payAmount?.toLocaleString()} KAS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mutedtext text-base">Service fee</span>
              <span className="text-mutedtext text-base text-right">{serviceFee} KAS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mutedtext text-base">Network fee</span>
              <span className="text-mutedtext text-base text-right">
                {networkFee ? `${networkFee} KAS` : 'Calculating...'}
              </span>
            </div>

            <TotalCostToMint totalFees={totalFees} />
          </div>
        </div>
      </AnimatedMain>
      <div className="fixed bottom-20 left-0 right-0 px-4">
        <NextButton onClick={handleMint} text="Confirm Mint" />
      </div>
      <BottomNav />
    </>
  )
}
