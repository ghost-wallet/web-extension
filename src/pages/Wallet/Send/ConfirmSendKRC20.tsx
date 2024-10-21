import React, { useCallback, useState } from 'react'
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
  const { request } = useKaspa()

  const handleConfirmClick = useCallback(() => {
    setLoading(true)
    setError('')

    request('account:writeInscription', [recipient, token, amount, feeRate])
      .then((response) => {
        console.log('[ConfirmSendKRC20] write inscription success. Response:', response)
        // const commitTxnId = response[0]
        const txnId = response[1]
        navigate('/send/crypto/confirm/sent', {
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
            fee={'TODO: Implement'}
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
