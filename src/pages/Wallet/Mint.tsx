import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BottomNav from '@/components/navigation/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import { fetchKrc20TokenInfo } from '@/hooks/kasplex/fetchKrc20TokenInfo'
import { KRC20TokenResponse, KsprToken } from '@/utils/interfaces'
import { getButtonLabel } from '@/utils/labels'
import { checkIfMintable } from '@/utils/validation'
import TokenDetails from '@/pages/Wallet/Mint/TokenDetails'
import SearchBar from '@/pages/Wallet/Mint/SearchBar'
import ErrorMessage from '@/components/messages/ErrorMessage'
import NextButton from '@/components/buttons/NextButton'
import TopNav from '@/components/navigation/TopNav'
import { useKsprPrices } from '@/hooks/kspr/fetchKsprPrices'
import { usePrices } from '@/hooks/ghost/usePrice'
import useSettings from '@/hooks/contexts/useSettings'
import { useKrc20TokenList } from '@/hooks/kasplex/useKrc20TokenList'
import ErrorMessages from '@/utils/constants/errorMessages'
import { fetchKasFyiMarketData } from '@/hooks/kas-fyi/fetchMarketData'
import MintLoading from '@/pages/Wallet/Mint/MintLoading'
import BottomFixedContainer from '@/components/containers/BottomFixedContainer'

export default function Mint() {
  const location = useLocation()
  const ticker = location.state?.ticker || null
  const [token, setToken] = useState<KRC20TokenResponse | null>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const { settings } = useSettings()
  const selectedNetwork = settings.nodes[settings.selectedNode].address
  const ksprPricesQuery = useKsprPrices()
  const prices = usePrices()
  const kasPrice = prices.data?.kaspa ?? 0
  const usdtPrice = prices.data?.tether ?? 0
  const krc20TokenListQuery = useKrc20TokenList()
  const scrollableContainerRef = useRef<HTMLDivElement>(null)

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
      const result = await fetchKrc20TokenInfo(settings.selectedNode, ticker)
      if (result) {
        const ksprPriceData: KsprToken | undefined = ksprPricesQuery.data?.[result.tick]
        const kasFyiMarketData = await fetchKasFyiMarketData([result.tick])
        let floorPrice
        if (kasFyiMarketData) {
          const kasFyiToken = kasFyiMarketData.results.find((data) => data.ticker === result.tick)
          floorPrice = result.tick === 'CUSDT' ? usdtPrice : (kasFyiToken?.price.kas || 0) * kasPrice
        } else {
          floorPrice = ksprPriceData?.floor_price ? ksprPriceData.floor_price * kasPrice : 0
        }
        setToken({ ...result, floorPrice })
      } else {
        console.error('Token not found to mint')
        setError(ErrorMessages.MINT.TOKEN_NOT_FOUND(ticker.toUpperCase()))
      }
    } catch (err: any) {
      console.error('Mint token search failed', err)
      const errorMessage = err.message || ErrorMessages.MINT.SEARCH_FAILED(ticker)
      setError(errorMessage)
    } finally {
      setLoading(false)
      if (scrollableContainerRef.current) {
        scrollableContainerRef.current.scrollTo(0, 0)
      }
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
      <AnimatedMain className={`flex flex-col h-screen w-full`}>
        <div className="flex flex-col flex-grow px-4 pt-4 overflow-y-auto" ref={scrollableContainerRef}>
          {selectedNetwork === 'testnet-11' && (
            <p className="text-warning text-center text-base mb-4">
              KRC20 tokens cannot be minted on {selectedNetwork}. Try a different network.
            </p>
          )}
          {selectedNetwork !== 'testnet-11' && (
            <SearchBar onSearch={handleSearch} krc20TokenList={tokenList} />
          )}
          {loading ? (
            <div className="mt-10">
              <MintLoading />
            </div>
          ) : (
            error && <ErrorMessage message={error} className="pt-2 flex justify-center items-center" />
          )}
          {token && <TokenDetails token={token} />}
        </div>
      </AnimatedMain>
      {token && (
        <BottomFixedContainer shadow={false} className="px-4 pb-[72px] bg-transparent">
          <NextButton text={canMintLabel} buttonEnabled={isMintable} onClick={handleContinue} />
        </BottomFixedContainer>
      )}
      <BottomNav />
    </>
  )
}
