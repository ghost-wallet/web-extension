import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { KsprTokenResponse } from '@/utils/interfaces'

/**
 * Fetches the KSPR token data from the marketplace JSON endpoint.
 * @returns An object of KSPR tokens, where each key is a token symbol.
 *
 * KSPR Bot dev Dwayne says:
 * "replace timestamp by a timestamp of course, data are refreshed every 15 mins, floor price (price per unit) in KAS"
 * https://storage.googleapis.com/kspr-api-v1/marketplace/marketplace.json?t=TIMESTAMP
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
    staleTime: 900_000, // Cache for 15 minutes
    refetchInterval: 900_000, // Refetch every 15 minutes
  })
}