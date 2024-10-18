import { useEffect, useState } from 'react'
import axios from 'axios'
import useKaspa from '@/hooks/useKaspa'
import useSettings from '@/hooks/useSettings'
import useCoingecko from '@/hooks/useCoingecko'

export interface Token {
  tick: string
  balance: string
  opScoreMod: string
  dec: string
  floorPrice?: number
}

interface ApiResponse {
  result: Token[]
}

interface TokenInfoResponse {
  price?: {
    floorPrice?: number
  }
}

const CACHE_DURATION = 30000 // 30 seconds in milliseconds

const useKasplex = (refresh: boolean) => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { kaspa } = useKaspa()
  const { settings } = useSettings()
  const price = useCoingecko(settings.currency)

  useEffect(() => {
    const cachedTokens = localStorage.getItem(`tokens_${kaspa.addresses?.[0]?.[0]}`)
    const cachedTimestamp = localStorage.getItem(`timestamp_${kaspa.addresses?.[0]?.[0]}`)
    const currentTime = Date.now()

    if (
      !refresh &&
      cachedTokens &&
      cachedTimestamp &&
      currentTime - parseInt(cachedTimestamp) < CACHE_DURATION
    ) {
      // Use the cached tokens if still valid
      setTokens(JSON.parse(cachedTokens))
      setLoading(false)
    } else {
      // Fetch tokens if the cache is expired or not available
      const fetchTokens = async () => {
        try {
          setLoading(true)
          setError(null)

          const apiBase =
            settings.selectedNode === 0 ? 'api' : settings.selectedNode === 1 ? 'tn10api' : 'tn11api'

          const response = await axios.get<ApiResponse>(
            `https://${apiBase}.kasplex.org/v1/krc20/address/${
              kaspa.addresses[0][kaspa.addresses[0].length - 1]
            }/tokenlist`,
          )

          if (response.data && response.data.result) {
            const tokensWithPrices = await Promise.all(
              response.data.result.map(async (token: Token) => {
                try {
                  const tokenInfoResponse = await axios.get<TokenInfoResponse>(
                    `https://api-v2-do.kas.fyi/token/krc20/${token.tick}/info`,
                  )

                  const tokenData = tokenInfoResponse.data as TokenInfoResponse
                  const floorPrice = ((tokenData?.price?.floorPrice || 0) * price).toFixed(8)

                  return { ...token, floorPrice: parseFloat(floorPrice) }
                } catch (err) {
                  console.error(`Error fetching info for ${token.tick}:`, err)
                  return { ...token, floorPrice: 0 }
                }
              }),
            )

            setTokens(tokensWithPrices)
            setLoading(false)

            localStorage.setItem(`tokens_${kaspa.addresses[0][0]}`, JSON.stringify(tokensWithPrices))
            localStorage.setItem(`timestamp_${kaspa.addresses[0][0]}`, currentTime.toString())
          } else {
            throw new Error('Invalid API response structure')
          }
        } catch (err) {
          console.error('Error fetching tokens:', err)
          setError('Error fetching tokens')
          setLoading(false)
        }
      }

      fetchTokens()
    }
  }, [kaspa.connected, kaspa.addresses, settings.selectedNode, price, refresh]) // Added refresh as dependency

  return { tokens, loading, error }
}

export default useKasplex
