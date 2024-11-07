import { useState } from 'react'

interface MintRequest {
  tick: string
  timesToMint: number
  address: string
}

export function useMint() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  const postMint = async (mintRequest: MintRequest) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('https://ghost-server-wpm2s.ondigitalocean.app/v1/krc20/mint/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mintRequest),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err: any) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return { postMint, loading, error, data }
}
