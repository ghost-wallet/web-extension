import React, { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import ConfirmSendDetails from '@/components/ConfirmSendDetails'
import Spinner from '@/components/Spinner'
import useKaspa from '@/hooks/contexts/useKaspa'

const ConfirmSend: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token, recipient, amount, transactions = [], fee } = location.state || {}
  const { request } = useKaspa()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleConfirmClick = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      if (!transactions || transactions.length === 0) {
        throw new Error('No transactions found')
      }

      let updatedTransactions = transactions ? [...transactions] : []
      const parsedTransactions = JSON.parse(transactions[0])
      if (!parsedTransactions?.inputs?.length) {
        throw new Error('No inputs found in transaction')
      }

      const submitContextful = await request('account:submitKaspaTransaction', [updatedTransactions])
      const txnId = submitContextful[0]

      navigate(`/send/${token.tick}/confirm/sent`, {
        state: { token, amount, recipient, txnId },
      })
    } catch (err) {
      console.error('Error confirming transaction:', err)
      setError(`Error confirming transaction: ${err}`)
    } finally {
      setLoading(false)
    }
  }, [request, transactions, navigate, token, amount, recipient])

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

export default ConfirmSend
