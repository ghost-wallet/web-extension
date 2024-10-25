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

  return (
    <>
      <AnimatedMain>
        <Header title="Mint" showBackButton={true} />
        <p className="px-6 mb-2 font-lato text-base text-mutedtext text-center">
          Lookup the KRC20 token you want to mint
        </p>
        <div className="px-6 pt-2 -mb-6">
          <KRC20TokenSearch onSearch={handleSearch} />
          <ErrorMessage message={error} />
        </div>
        <div className="px-6">{tokenInfo && <KRC20TokenDetails tokenInfo={tokenInfo} />}</div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
