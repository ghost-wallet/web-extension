import React, { useState } from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import CryptoImage from '@/components/cryptos/CryptoImage'

export default function Swap() {
  const [kaspaAmount, setKaspaAmount] = useState('')
  const [nachoAmount, setNachoAmount] = useState('')

  const handleKaspaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKaspaAmount(e.target.value)
  }

  const handleMaxKaspa = () => {
    // Logic to set maximum Kaspa value
    setKaspaAmount('MAX')
  }

  const handleSwap = () => {
    // Logic for swapping tokens
  }

  return (
    <>
      <AnimatedMain>
        <Header title="Swap" showBackButton={true} />
        <div className="p-6">
          {/* You Pay Section */}
          <div className="bg-darkmuted rounded-lg p-4 mb-4">
            <h2 className="text-primarytext text-lg font-lato mb-2">You Pay</h2>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={kaspaAmount}
                onChange={handleKaspaChange}
                placeholder="0"
                className="bg-transparent text-primarytext text-3xl font-semibold"
              />
              <CryptoImage ticker="KASPA" size="large" />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-mutedtext">$0.00</span>
              <button className="text-primary font-semibold hover:underline" onClick={handleMaxKaspa}>
                Max
              </button>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center my-4">
            <button className="bg-primary rounded-full p-3 hover:bg-secondary" onClick={handleSwap}>
              <span className="material-icons text-secondarytext">swap_horiz</span>
            </button>
          </div>

          {/* You Receive Section */}
          <div className="bg-darkmuted rounded-lg p-4">
            <h2 className="text-primarytext text-lg font-lato mb-2">You Receive</h2>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={nachoAmount}
                placeholder="0"
                readOnly
                className="bg-transparent text-primarytext text-3xl font-semibold"
              />
              <CryptoImage ticker="NACHO" size="large" />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-mutedtext">$0.00</span>
              <span className="text-mutedtext">0</span>
            </div>
          </div>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
