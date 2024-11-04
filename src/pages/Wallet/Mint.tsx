import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import { fetchKrc20TokenInfo } from '@/hooks/kasplex/fetchKrc20TokenInfo'
import { KRC20TokenResponse, KsprToken } from '@/utils/interfaces'
import { getButtonLabel } from '@/utils/labels'
import { checkIfMintable } from '@/utils/validation'
import TokenDetails from '@/pages/Wallet/Mint/TokenDetails'
import SearchBar from '@/pages/Wallet/Mint/SearchBar'
import ErrorMessage from '@/components/ErrorMessage'
import Spinner from '@/components/Spinner'
import NextButton from '@/components/buttons/NextButton'
import TopNav from '@/components/TopNav'
import { useKsprPrices } from '@/hooks/kspr/fetchKsprPrices'
import useKaspaPrice from '@/hooks/useKaspaPrice'
import useSettings from '@/hooks/contexts/useSettings'
import { useKrc20TokenList } from '@/hooks/kasplex/useKrc20TokenList'

export default function Mint() {
  const [token, setToken] = useState<KRC20TokenResponse | null>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const navigate = useNavigate()

  const ksprPricesQuery = useKsprPrices()
  const { settings } = useSettings()
  const kaspaPrice = useKaspaPrice(settings.currency)
  const kasPrice = kaspaPrice.data ?? 0
  const krc20TokenListQuery = useKrc20TokenList()

  const tokenList = krc20TokenListQuery.data?.map((token) => {
    const ksprPriceData: KsprToken | undefined = ksprPricesQuery.data?.[token.tick]
    const floorPrice = ksprPriceData?.floor_price ? ksprPriceData.floor_price * kasPrice : 0
    return { ...token, floorPrice }
  })

  const handleSearch = async (ticker: string) => {
    setError('')
    setToken(null)
    setLoading(true)

    try {
      const result = await fetchKrc20TokenInfo(0, ticker)
      if (result) {
        if (!ksprPricesQuery.data) return null
        const ksprPriceData: KsprToken | undefined = ksprPricesQuery.data[result.tick]
        const floorPrice = ksprPriceData?.floor_price ? ksprPriceData.floor_price * kasPrice : 0
        setToken({ ...result, floorPrice })
      } else {
        setError('No token found.')
      }
    } catch (err) {
      setError('An error occurred while fetching token info.')
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (token && isMintable) {
      navigate(`/mint/${token.tick}`, { state: { token } })
    }
  }

  const isMintable = checkIfMintable(token)
  const canMintLabel = getButtonLabel(token, isMintable)

  return (
    <>
      <TopNav />
      <AnimatedMain className={`flex flex-col h-screen w-full ${showSuggestions ? '' : 'fixed'}`}>
        <Header title="Mint" showBackButton={true} />
        <div className="flex flex-col flex-grow px-4">
          {tokenList && (
            <SearchBar
              onSearch={handleSearch}
              onToggleSuggestions={setShowSuggestions}
              krc20TokenList={tokenList}
            />
          )}
          {loading ? (
            <div className="mt-10">
              <Spinner />
            </div>
          ) : (
            error && <ErrorMessage message={error} />
          )}
          {token && <TokenDetails token={token} />}
        </div>
      </AnimatedMain>
      {/*TODO: fix bug - show button even while suggestions are showing*/}
      {token && (
        <div className={`bottom-20 left-0 right-0 px-4 ${showSuggestions ? '' : 'fixed'} z-0`}>
          <NextButton text={canMintLabel} buttonEnabled={isMintable} onClick={handleContinue} />
        </div>
      )}
      <BottomNav />
    </>
  )
}
