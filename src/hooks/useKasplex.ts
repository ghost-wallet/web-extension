import { useEffect, useState } from 'react'
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
  const { kaspa } = useKaspa()
  const { settings } = useSettings()
  const price = useCoingecko(settings.currency)

  useEffect(() => {
    if (price === 0) {
      return
    }

    const fetchTokens = async () => {
      try {
        const apiBase =
          settings.selectedNode === 0 ? 'api' : settings.selectedNode === 1 ? 'tn10api' : 'tn11api'

        const response = await axios.get<ApiResponse>(
          `https://${apiBase}.kasplex.org/v1/krc20/address/${kaspa.addresses[0][kaspa.addresses[0].length - 1]}/tokenlist`,
        )

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
      } catch (err) {
        console.error('Error fetching tokens:', err)
        setError('Error loading KRC20 tokens. Log out and log back in from the Settings page.')
        setLoading(false)
      }
    }

    fetchTokens()
  }, [kaspa.addresses, settings.selectedNode, price])

  return { tokens, loading, error }
}

export default useKasplex
