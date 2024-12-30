import axios from 'axios'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getApiBase } from '@/hooks/kasplex/fetchHelper'
import ErrorMessages from '@/utils/constants/errorMessages'
import { Krc20AccountTokenFromApi, Krc20AddressTokenListResponse } from '@/types/kasplex'


export const fetchKrc20AddressTokenList = async (selectedNode: number, address: string) => {
  const apiBase = getApiBase(selectedNode)

  try {
    let allTokens: Krc20AccountTokenFromApi[] = []
    let nextPage: string | null = null

    do {
      const params = new URLSearchParams()
      if (nextPage) {
        params.append('next', nextPage)
      }

      const response = await axios.get<Krc20AddressTokenListResponse>(
        `https://${apiBase}.kasplex.org/v1/krc20/address/${address}/tokenlist?${params.toString()}`,
      )

      if (response.data && response.data.result) {
        allTokens = [...allTokens, ...response.data.result]
        nextPage = response.data.next
      } else if (response.status === 204) {
        throw new Error(ErrorMessages.KRC20.KASPLEX_204)
      } else {
        throw new Error(ErrorMessages.KRC20.KASPLEX_UNKNOWN(response.status))
      }
    } while (nextPage)

    return allTokens
  } catch (error) {
    console.error(`Error fetching KRC20 token list for address ${address}:`, error)
    throw error
  }
}

export const isKrc20QueryEnabled = (kaspa: any, selectedNetwork: string) => {
  return useMemo(() => {
    if (!(kaspa.addresses.length > 0)) return false
    const address = kaspa.addresses[0]
    if (kaspa.connected && selectedNetwork === 'mainnet' && address.startsWith('kaspa:')) {
      return true
    }
    return kaspa.connected && selectedNetwork === 'testnet-10' && address.startsWith('kaspatest:')
  }, [kaspa.addresses, kaspa.connected, selectedNetwork])
}

export const useKrc20TokensQuery = (settings: any, kaspa: any, isQueryEnabled: boolean) => {
  return useQuery({
    queryKey: ['krc20Tokens', { selectedNode: settings.selectedNode, address: kaspa.addresses[0] }],
    queryFn: async () => fetchKrc20AddressTokenList(settings.selectedNode, kaspa.addresses[0]),
    enabled: isQueryEnabled,
    staleTime: 6000,
    refetchInterval: 6000,
  })
}
