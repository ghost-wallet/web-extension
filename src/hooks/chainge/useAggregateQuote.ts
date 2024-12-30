import { useEffect, useState } from 'react'
import { ChaingeAggregateQuote, fetchAggregateQuote } from '@/hooks/chainge/fetchAggregateQuote'
import { decimalToBigint, formatNumberWithDecimal } from '@/utils/formatting'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'

// TODO refetch every 15 seconds
const useAggregateQuote = (
  payToken: ChaingeToken | null,
  receiveToken: ChaingeToken | null,
  payAmount: string,
) => {
  const [aggregateQuote, setAggregateQuote] = useState<ChaingeAggregateQuote | undefined>(undefined)
  const [receiveAmount, setReceiveAmount] = useState('')
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    const fetchQuote = async () => {
      if (!payAmount || !(Number(payAmount) > 0)) {
        setReceiveAmount('')
        return
      }

      if (payToken && receiveToken && payAmount && !isNaN(Number(payAmount))) {
        setLoadingQuote(true)
        await new Promise((resolve) => setTimeout(resolve, 200))
        setError(null)
        try {
          const adjustedPayAmount = decimalToBigint(payAmount, payToken.decimals).toString()
          const quote = await fetchAggregateQuote(payToken, receiveToken, adjustedPayAmount, { signal })
          setAggregateQuote(quote)
          if (quote) {
            setReceiveAmount(formatNumberWithDecimal(quote.outAmount, quote.chainDecimal).toString())
          } else {
            setReceiveAmount('')
          }
        } catch (error: any) {
          if (error.name === 'AbortError') {
            console.error('Fetch aborted for Chainge aggregate quote')
          } else {
            console.error('Error getting aggregate quote from Chainge API:', error)
            setError('Chainge DEX error. Please try again.')
            setReceiveAmount('')
          }
        } finally {
          setLoadingQuote(false)
        }
      }
    }

    fetchQuote()

    return () => {
      controller.abort() // Cancel the previous request on cleanup
    }
  }, [payAmount, payToken, receiveToken])

  return { aggregateQuote, receiveAmount, setReceiveAmount, loadingQuote, quoteError: error }
}

export default useAggregateQuote
