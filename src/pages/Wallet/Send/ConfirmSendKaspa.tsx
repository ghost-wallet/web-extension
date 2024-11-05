import React, { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/navigation/BottomNav'
import ConfirmSendDetails from '@/pages/Wallet/Send/ConfirmSendDetails'
import useKaspa from '@/hooks/contexts/useKaspa'
import useSettings from '@/hooks/contexts/useSettings'
import TopNav from '@/components/navigation/TopNav'
import NextButton from '@/components/buttons/NextButton'
import SpinnerPage from '@/components/loaders/SpinnerPage'

const ConfirmSendKaspa: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token, recipient, amount, outputs, fee, feeRate } = location.state || {}
  const { request } = useKaspa()
  const { settings } = useSettings()
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
      <TopNav />
      <AnimatedMain className="flex flex-col h-screen w-full fixed">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <SpinnerPage />
          </div>
        ) : (
          <ConfirmSendDetails
            token={token}
            recipient={recipient}
            amount={amount}
            fee={fee}
            network={settings.nodes[settings.selectedNode].address}
            loading={loading}
            error={error}
          />
        )}
      </AnimatedMain>
      {!loading && (
        <div className="bottom-20 left-0 right-0 px-4 fixed">
          <NextButton onClick={handleConfirmClick} text={'Confirm Send'} />
        </div>
      )}
      {!loading && <BottomNav />}
    </>
  )
}

export default ConfirmSendKaspa
