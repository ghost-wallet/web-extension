import { useEffect, useState } from 'react'
import { fetchFromCoinGecko } from './coingecko/fetchFromCoinGecko'
import { fetchFromKaspaApi } from './kaspa/fetchFromKaspaApi'

export default function useKaspaPrice(currency: string) {
  const [price, setPrice] = useState(0)

  useEffect(() => {
    const fetchPrice = async () => {
      const cachedPrice = localStorage.getItem(`price_${currency}`)
      const cachedTimestamp = localStorage.getItem(`timestamp_${currency}`)
      const currentTime = Date.now()

      // If cached price is valid, use it
      if (cachedPrice && cachedTimestamp && currentTime - parseInt(cachedTimestamp) < 5000) {
        setPrice(parseFloat(cachedPrice))
      } else {
        try {
          // Try fetching from CoinGecko API
          const newPrice = await fetchFromCoinGecko(currency)
          setPrice(newPrice)

          // Cache the new price and timestamp from CoinGecko
          localStorage.setItem(`price_${currency}`, newPrice.toString())
          localStorage.setItem(`timestamp_${currency}`, currentTime.toString())
        } catch (error) {
          console.error('Failed to fetch from CoinGecko, falling back to Kaspa API.', error)

          // Fallback to Kaspa API if CoinGecko fails
          try {
            const newPrice = await fetchFromKaspaApi()
            setPrice(newPrice)

            // Cache the new price and timestamp from Kaspa API
            localStorage.setItem(`price_${currency}`, newPrice.toString())
            localStorage.setItem(`timestamp_${currency}`, currentTime.toString())
          } catch (kaspaError) {
            console.error('Error fetching price from Kaspa API:', kaspaError)
          }
        }
      }
    }

    fetchPrice()
  }, [currency])

  return price
}
