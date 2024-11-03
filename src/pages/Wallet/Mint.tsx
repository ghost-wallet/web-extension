import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import { fetchKrc20TokenInfo } from '@/hooks/kasplex/fetchKrc20TokenInfo'
import { KRC20TokenResponse } from '@/utils/interfaces'
import { checkIfMintable } from '@/utils/validation'
import TokenDetails from '@/pages/Wallet/Mint/TokenDetails'
import SearchBar from '@/pages/Wallet/Mint/SearchBar'
import ErrorMessage from '@/components/ErrorMessage'
import Spinner from '@/components/Spinner'
import NextButton from '@/components/buttons/NextButton'
import TopNav from '@/components/TopNav'

export default function Mint() {
  const [token, setToken] = useState<KRC20TokenResponse | null>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleSearch = async (ticker: string) => {
    setError('')
    setToken(null)
    setLoading(true)

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
      setLoading(false)
    }
  }

  const isMintable = checkIfMintable(token)

  const getButtonLabel = () => {
    if (!token || token.state === 'unused') return 'Token Not Deployed'
    if (!isMintable) return 'Supply Is Already Minted'
    return 'Next'
  }

  const handleContinue = () => {
    if (token && isMintable) {
      navigate(`/mint/${token.tick}`, { state: { token } })
    }
  }

  return (
    <>
      <TopNav />
      <AnimatedMain className="flex flex-col h-screen">
        <Header title="Mint" showBackButton={true} />
        <div className="flex flex-col flex-grow px-4">
          <SearchBar onSearch={handleSearch} />
          {loading ? (
            <div className="mt-10">
              <Spinner />
            </div>
          ) : (
            error && <ErrorMessage message={error} />
          )}
          {token && <TokenDetails token={token} />}
        </div>
        {token && (
          <div className="px-4 pt-2 pb-20">
            <NextButton text={getButtonLabel()} buttonEnabled={isMintable} onClick={handleContinue} />
          </div>
        )}
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
