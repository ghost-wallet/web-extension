import { useState, useEffect } from 'react'
import useKaspa from '@/hooks/contexts/useKaspa'

export const useFeeRate = () => {
  const { request } = useKaspa()
  const [feeRates, setFeeRates] = useState({
    slow: 1,
    standard: 1,
    fast: 1,
  })
  const [error, setError] = useState<string | null>(null)

  const updateFeeRate = () => {
    request('node:priorityBuckets', [])
      .then((buckets) => {
        setFeeRates({
          slow: buckets.slow.feeRate,
          standard: buckets.standard.feeRate,
          fast: buckets.fast.feeRate,
        })
      })
      .catch((err) => {
        console.error('Error fetching fee rates:', err)
        setError('Failed to retrieve the fee rate.')
      })
  }

  useEffect(() => {
    updateFeeRate()
  }, [request])

  return { feeRates, updateFeeRate, error }
}
