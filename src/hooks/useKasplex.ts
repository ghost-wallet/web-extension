import { useEffect, useState, useRef, useContext } from 'react'
import axios from 'axios'
import useKaspa from '@/hooks/useKaspa'
import useSettings from '@/hooks/useSettings'
import useCoingecko from '@/hooks/useCoingecko'

interface Token {
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

const useKasplex = () => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { kaspa, networkLoading } = useKaspa()
  const { settings } = useSettings()
  const price = useCoingecko(settings.currency)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    // Only proceed if the network is not loading
    if (networkLoading) {
      console.warn('Network is still connecting. Skipping token fetch.')
      return
    }

    // Ensure the price is valid and the node is connected
    if (
      !kaspa.connected ||
      !Array.isArray(kaspa.addresses) ||
      (kaspa.addresses?.[0] ?? []).length === 0
    ) {
      console.warn('Kaspa is not connected or addresses are unavailable. Skipping fetch.')
      setLoading(false)
      return
    }

    if (price === 0) {
      console.warn('Price is zero. Skipping fetch.')
      setLoading(false)
      return
    }

    const fetchTokens = async () => {
      try {
        setLoading(true)
        setError(null)

        const apiBase =
          settings.selectedNode === 0 ? 'api' : settings.selectedNode === 1 ? 'tn10api' : 'tn11api'

        const response = await axios.get<ApiResponse>(
          `https://${apiBase}.kasplex.org/v1/krc20/address/${kaspa.addresses[0][kaspa.addresses[0].length - 1]}/tokenlist`,
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

          if (isMounted.current) {
            setTokens(tokensWithPrices)
            setLoading(false)
          }
        } else {
          throw new Error('Invalid API response structure')
        }
      } catch (err) {
        console.error('Error fetching tokens:', err)
        if (isMounted.current) {
          setLoading(false)
        }
      }
    }

    fetchTokens()
  }, [kaspa.connected, kaspa.addresses, settings.selectedNode, price, networkLoading])

  return { tokens, loading, error }
}

export default useKasplex
