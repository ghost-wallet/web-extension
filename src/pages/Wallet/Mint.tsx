import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BottomNav from '@/components/navigation/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import { fetchKrc20TokenInfo } from '@/hooks/kasplex/fetchKrc20TokenInfo'
import { KRC20TokenResponse, KsprToken } from '@/utils/interfaces'
import { getButtonLabel } from '@/utils/labels'
import { checkIfMintable } from '@/utils/validation'
import TokenDetails from '@/pages/Wallet/Mint/TokenDetails'
import SearchBar from '@/pages/Wallet/Mint/SearchBar'
import ErrorMessage from '@/components/messages/ErrorMessage'
import Spinner from '@/components/loaders/Spinner'
import NextButton from '@/components/buttons/NextButton'
import TopNav from '@/components/navigation/TopNav'
import { useKsprPrices } from '@/hooks/kspr/fetchKsprPrices'
import useKaspaPrice from '@/hooks/kaspa/useKaspaPrice'
import useSettings from '@/hooks/contexts/useSettings'
import { useKrc20TokenList } from '@/hooks/kasplex/useKrc20TokenList'
import ErrorMessages from '@/utils/constants/errorMessages'

export default function Mint() {
  const location = useLocation()
  const ticker = location.state?.ticker || null
  const [token, setToken] = useState<KRC20TokenResponse | null>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const navigate = useNavigate()
  const { settings } = useSettings()
  const selectedNetwork = settings.nodes[settings.selectedNode].address
  const ksprPricesQuery = useKsprPrices()
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
        setError(ErrorMessages.MINT.TOKEN_NOT_FOUND(ticker))
      }
    } catch (err) {
      setError(ErrorMessages.MINT.SEARCH_FAILED(ticker))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (ticker) {
      handleSearch(ticker)
    }
  }, [ticker])

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
          {selectedNetwork === 'testnet-11' && (
            <p className="text-warning text-center text-base mb-4">
              KRC20 tokens cannot be minted on {selectedNetwork}. Try a different network.
            </p>
          )}
          {selectedNetwork !== 'testnet-11' && (
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
            error && (
              <ErrorMessage message={error} className="h-6 mb-4 mt-2 flex justify-center items-center" />
            )
          )}
          {token && <TokenDetails token={token} />}
        </div>
      </AnimatedMain>
      {token && (
        <div className={`bottom-20 left-0 right-0 px-4 ${showSuggestions ? '' : 'fixed'} z-0`}>
          <NextButton text={canMintLabel} buttonEnabled={isMintable} onClick={handleContinue} />
        </div>
      )}
      <BottomNav />
    </>
  )
}
