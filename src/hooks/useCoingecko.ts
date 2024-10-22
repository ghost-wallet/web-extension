import { useEffect, useState } from 'react'

export default function useCoingecko(currency: string) {
  const [price, setPrice] = useState(0)

  useEffect(() => {
    // Try to get the cached price from localStorage
    const cachedPrice = localStorage.getItem(`price_${currency}`)
    const cachedTimestamp = localStorage.getItem(`timestamp_${currency}`)
    const currentTime = Date.now()

    if (cachedPrice && cachedTimestamp && currentTime - parseInt(cachedTimestamp) < 5000) {
      // Use the cached price if it's still valid
      setPrice(parseFloat(cachedPrice))
    } else {
      // Fetch from the API if the cache is expired or not available
      fetch(`https://api.coingecko.com/api/v3/simple/price?ids=kaspa&vs_currencies=${currency}`)
        .then(async (res) => {
          if (res.ok) {
            const response = await res.json()
            const newPrice = response.kaspa[currency.toLowerCase()]
            setPrice(newPrice)

            // Cache the new price and timestamp
            localStorage.setItem(`price_${currency}`, newPrice.toString())
            localStorage.setItem(`timestamp_${currency}`, currentTime.toString())
          } else if (res.status === 429) {
            console.error('Rate limit exceeded. Please try again later.')
          }
        })
        .catch((error) => {
          console.error('Error fetching price:', error)
        })
    }
  }, [currency])

  return price
}
