import React, { useEffect, useState } from 'react'
import axios from 'axios'
import useKaspa from '@/hooks/useKaspa'
import useSettings from '@/hooks/useSettings'

interface Token {
  tick: string
  balance: string
  opScoreMod: string
  dec: string
}

interface ApiResponse {
  result: Token[]
}

const KRC20Tokens: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { kaspa } = useKaspa()
  const { settings } = useSettings()
  console.log('selected node', settings.selectedNode)

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        // Determine the API base URL based on the selected node
        const apiBase =
          settings.selectedNode === 0
            ? 'api'
            : settings.selectedNode === 1
              ? 'tn10api'
              : 'tn11api'

        const response = await axios.get<ApiResponse>(
          `https://${apiBase}.kasplex.org/v1/krc20/address/${kaspa.addresses[0][kaspa.addresses[0].length - 1]}/tokenlist`,
        )
        console.log('Kasplex KRC20 API response', response)
        setTokens(response.data.result)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching tokens:', err)
        setError('Failed to fetch KRC20 tokens')
        setLoading(false)
      }
    }

    fetchTokens()
  }, [kaspa.addresses, settings.selectedNode])

  const formatBalance = (balance: string, decimals: string) => {
    const dec = parseInt(decimals, 10)
    if (dec === 0) return balance

    return balance.slice(0, -dec) || '0'
  }

  if (loading) return <p className="text-mutedtext text-base">Loading...</p>
  if (error) return <p className="text-error text-base">{error}</p>

  return (
    <div>
      <h2 className="text-2xl text-primarytext font-lato mb-4">KRC20 Tokens</h2>
      <ul>
        {tokens.map((token) => (
          <li
            key={token.opScoreMod}
            className="mb-2 p-2 flex justify-between items-center w-full"
          >
            <span className="text-base text-primarytext font-lato">
              {token.tick}
            </span>
            <span className="text-base text-primarytext font-lato ml-4">
              {formatBalance(token.balance, token.dec)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default KRC20Tokens
