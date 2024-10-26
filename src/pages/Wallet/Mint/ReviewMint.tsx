import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import { formatBalanceWithAbbreviation } from '@/utils/formatting'
import { KRC20TokenResponse } from '@/utils/interfaces'
import useKaspa from '@/hooks/contexts/useKaspa'
import CryptoImage from '@/components/cryptos/CryptoImage'
import SpinnerPage from '@/components/SpinnerPage'

export default function ReviewMint() {
  const location = useLocation()
  const navigate = useNavigate()
  const { request } = useKaspa()
  const token = location.state?.token as KRC20TokenResponse
  const payAmount = location.state?.payAmount as number
  const receiveAmount = location.state?.receiveAmount as number
  const [estimatedFee, setEstimatedFee] = useState<string | null>(null)
  const [isMinting, setIsMinting] = useState(false)

  useEffect(() => {
    const fetchEstimatedFees = async () => {
      try {
        const fees = await request('account:estimateKRC20MintFees', [token.tick, 1, payAmount])
        setEstimatedFee(fees[1])
      } catch (error) {
        console.error('Error fetching estimated fees:', error)
      }
    }
    fetchEstimatedFees()
  }, [payAmount, token, request])

  const handleMint = async () => {
    setIsMinting(true)
    try {
      const transactionIds = await request('account:doKRC20Mint', [token.tick, 1, payAmount])
      console.log('Minted txn ids:', transactionIds)
      // const txnId = result.txnId
      // Navigate to the Minted page with necessary state
      navigate(`/mint/${token.tick}/review/minted`, {
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
        <Header title="Review Mint" showBackButton={true} />
        <div className="px-4">
          <CryptoImage ticker={token.tick} size="large" />
          <div className="w-full max-w-md space-y-1 pt-2">
            <div className="flex justify-between mb-6 mt-6">
              <span className="text-mutedtext font-lato text-lg">Receive amount</span>
              <span className="text-primarytext font-lato text-lg">
                {receiveAmount.toLocaleString()} {token.tick}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-mutedtext font-lato text-base">Mint cost</span>
              <span className="text-mutedtext font-lato text-base">{payAmount?.toLocaleString()} KAS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mutedtext font-lato text-base">Fees</span>
              <span className="text-mutedtext font-lato text-base">
                {estimatedFee ? `${estimatedFee} KAS` : 'Calculating...'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-mutedtext font-lato text-base">Total</span>
              <span className="text-mutedtext font-lato text-base">
                {estimatedFee ? `TODO KAS` : 'Calculating...'}
              </span>
            </div>
          </div>
        </div>
        <div className="px-4 pt-32">
          <button
            onClick={handleMint}
            className="w-full h-[52px] text-lg font-lato font-semibold rounded-[25px] bg-primary text-secondarytext cursor-pointer hover:bg-hover"
          >
            {`Mint ${formatBalanceWithAbbreviation(receiveAmount)} ${token.tick}`}
          </button>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
