import React, { useMemo, useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import ConfirmSendDetails from '@/components/ConfirmSendDetails'
import Spinner from '@/components/Spinner' // Import your Spinner component
import useKaspa from '@/hooks/useKaspa'

const ConfirmSend: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token, recipient, amount, transactions = [] } = location.state || {}
  const { request } = useKaspa()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fee = useMemo(() => {
    try {
      const transaction = JSON.parse(transactions[transactions.length - 1])
      const inputValue = transaction.inputs.reduce((acc: bigint, input: any) => {
        return acc + BigInt(input.utxo!.amount)
      }, 0n)

      const outputValue = transaction.outputs.reduce((acc: bigint, output: any) => {
        return acc + BigInt(output.value)
      }, 0n)

      return Number(inputValue - outputValue) / 1e8 // Convert from smallest unit
    } catch (error) {
      console.error('Error calculating fee:', error)
      return 0
    }
  }, [transactions])

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

      const signedTransactions = await request('account:sign', [updatedTransactions])
      const submitContextful = await request('account:submitContextful', [signedTransactions])
      const txnId = submitContextful[0]

      navigate('/send/crypto/confirm/sent', {
        state: { token, amount, recipient, txnId },
      })
    } catch (err) {
      console.error('Error confirming transaction:', err)
      setError(`Error confirming transaction: ${err}`)
    } finally {
      setLoading(false)
    }
  }, [request, transactions, navigate, token, amount, recipient])

  const handleCancelClick = () => {
    navigate('/wallet')
  }

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

export default ConfirmSend
