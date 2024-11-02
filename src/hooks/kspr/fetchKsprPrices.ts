import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { KsprTokenResponse } from '@/utils/interfaces'

/**
 * Fetches the KSPR token data from the marketplace JSON endpoint.
 * @returns An object of KSPR tokens, where each key is a token symbol.
 */
const fetchKsprPrices = async (): Promise<KsprTokenResponse> => {
  const response = await axios.get<KsprTokenResponse>(
    'https://storage.googleapis.com/kspr-api-v1/marketplace/marketplace.json',
  )
  return response.data
}

/**
 * Custom hook to fetch and cache KSPR token data using React Query.
 * @returns The query result containing KSPR token data, loading state, and error.
 */
export const useKsprPrices = () => {
  return useQuery<KsprTokenResponse, Error>({
    queryKey: ['ksprPrices'],
    queryFn: fetchKsprPrices,
    staleTime: 300_000, // Cache for 5 minutes
    refetchInterval: 300_000, // Refetch every 5 minutes
  })
}
