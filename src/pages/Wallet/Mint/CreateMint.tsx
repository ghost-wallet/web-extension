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

  // Handler for input changes with value clamping to 1-10000 range
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(10000, Math.max(1, Number(e.target.value) || 0))
    setMintAmount(value)
  }

  return (
    <>
      <AnimatedMain>
        <Header title="Create Mint" showBackButton={true} />
        <div className="p-4">
          <div className="rounded-base text-mutedtext text-base font-lato text-center mb-6">
            Mint rate: {formatBalance(token.lim, token.dec).toLocaleString()} {token.tick} per 1 KAS
          </div>
          {/* Slider and Input for Mint Amount */}
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
            {/* Input Field */}
            <input
              type="number"
              min="1"
              max="10000"
              value={mintAmount}
              onChange={handleInputChange}
              className="w-full bg-darkmuted p-2 border border-muted rounded-lg text-primarytext text-center"
              placeholder="Enter mint amount"
            />
          </div>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
