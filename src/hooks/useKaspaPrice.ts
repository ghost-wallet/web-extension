import { useEffect, useState } from 'react'
import { fetchFromCoinGecko } from './coingecko/fetchFromCoinGecko'
import { fetchFromKaspaApi } from './kaspa/fetchFromKaspaApi'
import { useQuery } from '@tanstack/react-query'

export default function useKaspaPrice(currency: string) {
  const fetchPrice = async () => {
    try {
      // Try fetching from CoinGecko API
      const newPrice = await fetchFromCoinGecko(currency)
      return newPrice

    } catch (error) {
      console.error('Failed to fetch from CoinGecko, falling back to Kaspa API.', error)

      // Fallback to Kaspa API if CoinGecko fails
      try {
        const newPrice = await fetchFromKaspaApi()
        return newPrice

      } catch (kaspaError) {
        console.error('Error fetching price from Kaspa API:', kaspaError)
      }
    }
  }

  const query = useQuery({
    queryKey: ['kaspaPrice', currency],
    queryFn: fetchPrice,
    staleTime: 60_000, // 1 min
    refetchInterval: 60_000
  })

  return query
}
