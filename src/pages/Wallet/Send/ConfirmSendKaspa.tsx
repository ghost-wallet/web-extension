import React, { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import ConfirmSendDetails from '@/pages/Wallet/Send/ConfirmSendDetails'
import Spinner from '@/components/Spinner'
import useKaspa from '@/hooks/contexts/useKaspa'

const ConfirmSendKaspa: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token, recipient, amount, outputs, fee, feeRate } = location.state || {}
  const { request } = useKaspa()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleConfirmClick = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const [generatedTransactions] = await request('account:create', [outputs, feeRate, fee])
      if (!generatedTransactions || generatedTransactions.length === 0) {
        throw new Error('Failed to create transactions')
      }

      const [txnId] = await request('account:submitKaspaTransaction', [generatedTransactions])

      navigate(`/send/${token.tick}/sent`, {
        state: { token, amount, recipient, txnId },
      })
    } catch (err) {
      console.error('Error confirming transaction:', err)
      setError(`Error confirming transaction: ${err}`)
    } finally {
      setLoading(false)
    }
  }, [request, outputs, feeRate, fee, navigate, token, amount, recipient])

  return (
    <>
      <AnimatedMain>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : (
          <ConfirmSendDetails
            token={token}
            recipient={recipient}
            amount={amount}
            fee={fee}
            network="Mainnet"
            onConfirm={handleConfirmClick}
            loading={loading}
            error={error}
          />
        )}
      </AnimatedMain>
      {!loading && <BottomNav />}
    </>
  )
}

export default ConfirmSendKaspa
