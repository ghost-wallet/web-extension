import React, { useState } from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import CryptoImage from '@/components/cryptos/CryptoImage'

const tokens = [
  { ticker: 'KASPA', image: 'path_to_kaspa_image' }, // Update with actual image path
  { ticker: 'NACHO', image: 'path_to_nacho_image' }, // Update with actual image path
]

export default function Swap() {
  const [kaspaAmount, setKaspaAmount] = useState('')
  const [nachoAmount, setNachoAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState(tokens[0])

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

  const handleTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = tokens.find((token) => token.ticker === e.target.value)
    setSelectedToken(selected || tokens[0])
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
              {/* Token Amount Input */}
              <input
                type="text"
                value={kaspaAmount}
                onChange={handleKaspaChange}
                placeholder="0"
                className="bg-transparent text-primarytext text-3xl font-semibold w-24" // Set a width to make it narrower
              />

              <div className="flex items-center">
                <CryptoImage ticker={selectedToken.ticker} size="small" /> {/* Using size='small' */}
                <select
                  value={selectedToken.ticker}
                  onChange={handleTokenChange}
                  className="bg-darkmuted text-primarytext font-semibold ml-2" // Adjust margin for better alignment
                >
                  {tokens.map((token) => (
                    <option key={token.ticker} value={token.ticker}>
                      {token.ticker}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Token Value and Max/Percentage Options */}
            <div className="flex justify-between mt-2">
              <span className="text-mutedtext">$0.00</span> {/* Placeholder for USD value */}
              <div className="flex items-center space-x-2">
                <span className="text-mutedtext">2.23</span> {/* Placeholder for token balance */}
                <button className="text-mutedtext font-semibold hover:underline">50%</button>
                <button className="text-primary font-semibold hover:underline" onClick={handleMaxKaspa}>
                  Max
                </button>
              </div>
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
                className="bg-transparent text-primarytext text-3xl font-semibold w-24" // Narrow the width here as well
              />
              <div className="flex items-center">
                <img src={'path_to_nacho_image'} alt="NACHO" className="w-8 h-8 mr-2" />
                <span className="text-primarytext font-semibold">NACHO</span>
              </div>
            </div>

            <div className="flex justify-between mt-2">
              <span className="text-mutedtext">$0.00</span> {/* Placeholder for USD value */}
              <span className="text-mutedtext">0</span> {/* Placeholder for token balance */}
            </div>
          </div>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
