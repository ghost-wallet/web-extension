import { fetchFromCoinGecko } from '../coingecko/fetchFromCoinGecko';
import { useQuery } from '@tanstack/react-query';

export default function useKaspaPrice(currency: string) {
  return useQuery({
    queryKey: ['kaspaPrice', currency],
    queryFn: async () => {
      return await fetchFromCoinGecko(currency);
    },
    staleTime: 30_000, // 30 seconds
    refetchInterval: 30_000, // 30 seconds
    retry: 5, // React Query will retry 5 times on failure
    retryDelay: (attempt) => Math.min(3000 * attempt, 10000), // Exponential backoff with a cap of 10s
  });
}
