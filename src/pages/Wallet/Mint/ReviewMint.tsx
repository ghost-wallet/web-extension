import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import { formatBalanceWithAbbreviation } from '@/utils/formatting'
import { KRC20TokenResponse } from '@/utils/interfaces'
import useKaspa from '@/hooks/contexts/useKaspa'
import CryptoImage from '@/components/cryptos/CryptoImage'

//TODO fix Total. the estimated fee + payamount is not handling int & bigint properly
export default function ReviewMint() {
  const location = useLocation()
  const { request } = useKaspa()
  const token = location.state?.token as KRC20TokenResponse
  const payAmount = location.state?.payAmount as number
  const receiveAmount = location.state?.receiveAmount as number
  const [estimatedFee, setEstimatedFee] = useState<number | null>(null)

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
    try {
      const result = await request('account:doKRC20Mint', [token.tick, 1, payAmount])
      console.log('Mint result:', result)
    } catch (error) {
      console.error('Error during minting:', error)
    }
  }

  return (
    <>
      <AnimatedMain>
        <Header title="Review Mint" showBackButton={true} />
        <div className="px-4">
          <CryptoImage ticker={token.tick} size={'large'} />
          <div className="w-full max-w-md space-y-1 pt-2">
            <div className="flex justify-between mb-6 mt-6">
              {' '}
              {/* Add margin-bottom to create separation */}
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
