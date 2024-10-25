import React, { useState } from 'react'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import { fetchKrc20TokenInfo, Krc20TokenInfo } from '@/hooks/kasplex/fetchKrc20TokenInfo'
import KRC20TokenDetails from '@/components/KRC20TokenDetails'
import KRC20TokenSearch from '@/components/KRC20TokenSearch'
import ErrorMessage from '@/components/ErrorMessage'

export default function Mint() {
  const [tokenInfo, setTokenInfo] = useState<Krc20TokenInfo | null>(null)
  const [error, setError] = useState<string>('')

  const handleSearch = async (ticker: string) => {
    setError('')
    setTokenInfo(null)

    try {
      const result = await fetchKrc20TokenInfo(0, ticker)
      if (result) {
        setTokenInfo(result)
      } else {
        setError('No token found.')
      }
    } catch (err) {
      setError('An error occurred while fetching token info.')
    }
  }

  const isTokenValid = () => {
    if (!tokenInfo) return false

    const maxSupply = tokenInfo.max
    const mintedPercentage = (tokenInfo.minted / maxSupply) * 100

    // If max supply is 0, it's a non-token (invalid) or if minted percentage is 100%
    if (maxSupply === 0 || mintedPercentage >= 100) return false

    // Valid if minted percentage is less than 100%
    return mintedPercentage < 100
  }

  return (
    <>
      <AnimatedMain>
        <Header title="Mint" showBackButton={true} />
        <p className="px-6 mb-2 font-lato text-base text-mutedtext text-center -mt-4">
          Lookup the KRC20 token you want to mint
        </p>
        <div className="px-6 pt-2 -mb-6">
          <KRC20TokenSearch onSearch={handleSearch} />
          <ErrorMessage message={error} />
        </div>
        <div className="px-6">{tokenInfo && <KRC20TokenDetails tokenInfo={tokenInfo} />}</div>
        {tokenInfo && (
          <div className="px-6 pt-3">
            <button
              disabled={!isTokenValid()}
              className={`w-full h-[52px] text-base font-lato font-semibold rounded-[25px] ${
                isTokenValid()
                  ? 'bg-primary text-secondarytext cursor-pointer hover:bg-hover'
                  : 'bg-muted text-mutedtext cursor-not-allowed'
              }`}
            >
              {isTokenValid() ? 'Continue To Mint' : 'Supply Has Been 100% Minted'}
            </button>
          </div>
        )}
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
