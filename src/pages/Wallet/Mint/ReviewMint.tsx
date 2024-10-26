import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import { Krc20TokenInfo } from '@/hooks/kasplex/fetchKrc20TokenInfo'
import useKaspa from '@/hooks/contexts/useKaspa'

export default function ReviewMint() {
  const location = useLocation()
  const { request } = useKaspa()
  const token = location.state?.token as Krc20TokenInfo
  const payAmount = location.state?.payAmount as number
  const receiveAmount = location.state?.receiveAmount as string
  const [estimatedFee, setEstimatedFee] = useState<string | null>(null)

  useEffect(() => {
    const fetchEstimatedFees = async () => {
      try {
        const fees = await request('account:estimateKRC20MintFees', [token.tick, 1, payAmount])
        setEstimatedFee(fees[0])
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
        <div className="p-4">
          <div className="w-full max-w-md space-y-2 mt-6">
            <div className="flex justify-between">
              <span className="text-mutedtext font-lato text-base">You receive</span>
              <span className="text-primarytext font-lato text-base">
                {receiveAmount} {token.tick}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-mutedtext font-lato text-base">Mint cost</span>
              <span className="text-primarytext font-lato text-base">{payAmount?.toLocaleString()} KAS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mutedtext font-lato text-base">Total with fees</span>
              <span className="text-primarytext font-lato text-base">
                {estimatedFee ? `${estimatedFee} KAS` : 'Calculating...'}
              </span>
            </div>
          </div>
        </div>
        <div className="px-4 py-4">
          <button
            onClick={handleMint}
            className="w-full h-[52px] text-lg font-lato font-semibold rounded-[25px] bg-primary text-secondarytext cursor-pointer hover:bg-hover"
          >
            {`Mint ${token.tick} Now`}
          </button>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
