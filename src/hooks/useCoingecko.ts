import { useEffect, useState } from 'react'

export default function useCoingecko(currency: string) {
  const [price, setPrice] = useState(0)

  useEffect(() => {
    const cachedPrice = localStorage.getItem(`price_${currency}`)
    const cachedTimestamp = localStorage.getItem(`timestamp_${currency}`)
    const currentTime = Date.now()

    if (cachedPrice && cachedTimestamp && currentTime - parseInt(cachedTimestamp) < 30000) {
      setPrice(parseFloat(cachedPrice))
    } else {
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
          // TODO: If error, use another fallback API to get price.
          console.error('Error fetching price:', error)
        })
    }
  }, [currency])

  return price
}
