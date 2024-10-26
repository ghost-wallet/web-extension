import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import { fetchKrc20TokenInfo } from '@/hooks/kasplex/fetchKrc20TokenInfo'
import { KRC20TokenResponse } from '@/utils/interfaces'
import { getMintedPercentage } from '@/utils/calculations'
import KRC20TokenDetails from '@/pages/Wallet/Mint/KRC20TokenDetails'
import SearchBar from '@/pages/Wallet/Mint/SearchBar'
import ErrorMessage from '@/components/ErrorMessage'
import Spinner from '@/components/Spinner'

export default function Mint() {
  const [token, setToken] = useState<KRC20TokenResponse | null>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleSearch = async (ticker: string) => {
    setError('')
    setToken(null)
    setLoading(true) // Start loading when search is clicked

    try {
      const result = await fetchKrc20TokenInfo(0, ticker)
      if (result) {
        setToken(result)
      } else {
        setError('No token found.')
      }
    } catch (err) {
      setError('An error occurred while fetching token info.')
    } finally {
      setLoading(false) // Stop loading when search completes
    }
  }

  const isMintable = () => {
    if (!token) return false
    if (token.state === 'unused') return false

    const maxSupply = token.max
    const mintedPercentage = parseFloat(getMintedPercentage(token.minted, maxSupply))
    return maxSupply !== 0 && mintedPercentage < 100
  }

  const getButtonLabel = () => {
    if (!token) return 'Continue To Mint'
    if (token.state === 'unused') return 'Token Not Deployed'
    if (!isMintable()) return 'Supply Is Already Minted'
    return 'Continue To Mint'
  }

  const handleContinue = () => {
    if (token && isMintable()) {
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
          <SearchBar onSearch={handleSearch} />
          {loading ? (
            <div className="mt-10">
              <Spinner />
            </div>
          ) : (
            <ErrorMessage message={error} />
          )}
        </div>
        <div className="px-6">{token && <KRC20TokenDetails token={token} />}</div>
        {token && (
          <div className="px-6 pt-3">
            <button
              onClick={handleContinue}
              disabled={!isMintable() || token.state === 'unused'}
              className={`w-full h-[52px] text-lg font-lato font-semibold rounded-[25px] ${
                isMintable() && token.state !== 'unused'
                  ? 'bg-primary text-secondarytext cursor-pointer hover:bg-hover'
                  : 'bg-muted text-mutedtext cursor-not-allowed'
              }`}
            >
              {getButtonLabel()}
            </button>
          </div>
        )}
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
