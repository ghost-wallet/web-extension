import { useState, useEffect } from 'react'
import useKaspa from '@/hooks/contexts/useKaspa'

export const useBuckets = () => {
  const { request } = useKaspa()
  const [buckets, setBuckets] = useState({
    slow: { feeRate: 1, seconds: 1 },
    standard: { feeRate: 1, seconds: 1 },
    fast: { feeRate: 1, seconds: 1 },
  })
  const [error, setError] = useState<string | null>(null)

  const updateBuckets = () => {
    request('node:priorityBuckets', [])
      .then((_buckets) => {
        setBuckets(_buckets)
      })
      .catch((err) => {
        console.error('Error fetching fee buckets:', err)
        setError('Failed to retrieve the fee buckets.')
      })
  }

  useEffect(() => {
    updateBuckets()
  }, [request])

  return { buckets, updateBuckets, error }
}
