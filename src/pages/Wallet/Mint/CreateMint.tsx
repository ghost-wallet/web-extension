import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import { Krc20TokenInfo } from '@/hooks/kasplex/fetchKrc20TokenInfo'
import { formatBalance } from '@/utils/formatting'

export default function CreateMint() {
  const location = useLocation()
  const token = location.state?.token as Krc20TokenInfo

  const [mintAmount, setMintAmount] = useState(1)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMintAmount(Number(e.target.value))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(10000, Math.max(1, Number(e.target.value) || 0))
    setMintAmount(value)
  }

  // Calculate the total mint cost
  const totalMintCost = (
    parseFloat(String(formatBalance(token.lim, token.dec))) * mintAmount
  ).toLocaleString()

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
          </div>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
