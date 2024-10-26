import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import { fetchKrc20TokenInfo, Krc20TokenInfo } from '@/hooks/kasplex/fetchKrc20TokenInfo'
import KRC20TokenDetails from '@/components/KRC20TokenDetails'
import KRC20TokenSearch from '@/components/KRC20TokenSearch'
import ErrorMessage from '@/components/ErrorMessage'

export default function Mint() {
  const [token, setToken] = useState<Krc20TokenInfo | null>(null)
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()

  const handleSearch = async (ticker: string) => {
    setError('')
    setToken(null)

    try {
      const result = await fetchKrc20TokenInfo(0, ticker)
      if (result) {
        setToken(result)
      } else {
        setError('No token found.')
      }
    } catch (err) {
      setError('An error occurred while fetching token info.')
    }
  }

  const isTokenValid = () => {
    if (!token) return false

    const maxSupply = token.max
    const mintedPercentage = (token.minted / maxSupply) * 100

    return maxSupply !== 0 && mintedPercentage < 100
  }

  const handleContinue = () => {
    if (token) {
      navigate(`/mint/${token.tick}`, { state: { token } })
    }
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
        <div className="px-6">{token && <KRC20TokenDetails token={token} />}</div>
        {token && (
          <div className="px-6 pt-3">
            <button
              onClick={handleContinue}
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
