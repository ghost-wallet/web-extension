import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import ConfirmSendDetails from '@/components/ConfirmSendDetails'
import useKaspa from '@/hooks/useKaspa'
import SpinnerPage from '@/components/SpinnerPage'

const ConfirmSendKRC20: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token, recipient, amount, feeRate } = location.state || {}
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [estimatedFee, setEstimatedFee] = useState<string>('') // State to hold the estimated fee
  const { request } = useKaspa()

  const fetchEstimatedFee = useCallback(() => {
    request('account:getKRC20Info', [recipient, token, amount]).then((info) => {
      request('account:estimateKRC20TransactionFee', [info, feeRate])
        .then((response) => {
          const _estimatedFee = response
          setEstimatedFee(_estimatedFee || '')
          console.log('Estimated fee:', _estimatedFee)
        })
        .catch((err) => {
          setError(`Error fetching estimated fee: ${err}`)
          console.error('[ConfirmSendKRC20] error fetching estimated fee:', err)
        })
    })
  }, [request, recipient, token, amount, feeRate])

  useEffect(() => {
    fetchEstimatedFee()

    // Update estimated fee every 7 seconds
    const intervalId = setInterval(fetchEstimatedFee, 7000)
    return () => clearInterval(intervalId)
  }, [fetchEstimatedFee])

  const handleConfirmClick = useCallback(() => {
    setLoading(true)
    setError('')
    request('account:getKRC20Info', [recipient, token, amount]).then((info) => {
      request('account:submitKRC20Transaction', [info, feeRate])
      .then((response) => {
        console.log('[ConfirmSendKRC20] write inscription success. Response:', response)
        const txnId = response[1]
        navigate(`/send/${token.tick}/confirm/sent`, {
          state: { token, amount, recipient, txnId },
        })
      })
      .catch((err) => {
        setError(`Error: ${err}`)
        console.error('[ConfirmSendKRC20] error writing inscription:', err)
      })
      .finally(() => {
        setLoading(false)
      })
    })
  }, [request, recipient, token, amount, feeRate])

  const handleCancelClick = () => {
    navigate('/wallet')
  }

  return (
    <>
      <AnimatedMain>
        {loading ? (
          <SpinnerPage displayText={`Transferring ${amount} ${token.tick}...`} />
        ) : (
          <ConfirmSendDetails
            token={token}
            recipient={recipient}
            amount={amount}
            fee={estimatedFee || 'Calculating...'}
            network="Mainnet"
            onConfirm={handleConfirmClick}
            onCancel={handleCancelClick}
            loading={loading}
            error={error}
          />
        )}
      </AnimatedMain>
      {!loading && <BottomNav />}
    </>
  )
}

export default ConfirmSendKRC20
