import { useEffect, useState } from 'react'
import useKaspa from '@/hooks/useKaspa'

export const useFeeRate = () => {
  const [feeRate, setFeerate] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const { request } = useKaspa()

  useEffect(() => {
    request('node:priorityBuckets', [])
      .then((buckets) => setFeerate(buckets.standard.feeRate))
      .catch((err) => {
        console.error('Error fetching standard fee rate:', err)
        setError('Failed to retrieve the fee rate.')
      })
  }, [request])

  return { feeRate, error }
}
