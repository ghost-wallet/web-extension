import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import { Krc20TokenInfo } from '@/hooks/kasplex/fetchKrc20TokenInfo'
import { formatBalance } from '@/utils/formatting'
import useKaspa from '@/hooks/contexts/useKaspa' // Assuming you have a hook to use Kaspa's request function

export default function CreateMint() {
  const location = useLocation()
  const token = location.state?.token as Krc20TokenInfo
  const { request } = useKaspa() // To make API calls through request

  const [mintAmount, setMintAmount] = useState(1)
  const [estimatedFee, setEstimatedFee] = useState<string | null>(null)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMintAmount(Number(e.target.value))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(10000, Math.max(1, Number(e.target.value) || 0))
    setMintAmount(value)
  }

  // Fetch estimated fees whenever mint amount changes
  useEffect(() => {
    const estimateFees = async () => {
      try {
        const fees = await request('account:estimateKRC20MintFees', [token.tick, 1, mintAmount])
        setEstimatedFee(fees[0]) // Assume first fee in array as requested
      } catch (error) {
        console.error('Error estimating mint fees:', error)
        setEstimatedFee(null)
      }
    }

    estimateFees()
  }, [mintAmount, token, request])

  const handleMint = async () => {
    try {
      const result = await request('account:doKRC20Mint', [token.tick, 1, mintAmount])
      console.log('Mint result:', result)
    } catch (error) {
      console.error('Error during minting:', error)
    }
  }

  // Calculate the total mint cost
  const totalMintCost = (
    parseFloat(String(formatBalance(token.lim, token.dec))) * mintAmount
  ).toLocaleString()

  const isMintAmountValid = mintAmount >= 1 && mintAmount <= 10000

  return (
    <>
      <AnimatedMain>
        <Header title="Create Mint" showBackButton={true} />
        <div className="p-4">
          <div className="rounded-base text-mutedtext text-base font-lato text-center mb-6">
            Mint rate: {formatBalance(token.lim, token.dec).toLocaleString()} {token.tick} per 1 KAS
          </div>
          <div className="flex flex-col items-center space-y-4">
            {/* Slider */}
            <input
              type="range"
              min="1"
              max="10000"
              value={mintAmount}
              onChange={handleSliderChange}
              className="w-full cursor-pointer"
            />
            {/* Input with KAS label */}
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max="10000"
                value={mintAmount}
                onChange={handleInputChange}
                className="w-24 bg-darkmuted p-2 border border-muted rounded-lg text-primarytext text-center"
                placeholder="Enter amount"
              />
              <span className="font-lato text-primarytext text-base">KAS</span>
            </div>
            {/* Total Mint Cost Display */}
            <div className="text-primarytext font-lato text-base">
              {totalMintCost} {token.tick}
            </div>
            {/* Estimated Fee Display */}
            {estimatedFee && (
              <p className="text-mutedtext font-lato text-sm">Estimated Fee: {estimatedFee} KAS</p>
            )}
          </div>
        </div>
        <div className="px-4 py-4">
          <button
            onClick={handleMint}
            disabled={!isMintAmountValid}
            className={`w-full h-[52px] text-base font-lato font-semibold rounded-[25px] ${
              isMintAmountValid
                ? 'bg-primary text-secondarytext cursor-pointer hover:bg-hover'
                : 'bg-muted text-mutedtext cursor-not-allowed'
            }`}
          >
            Mint
          </button>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
