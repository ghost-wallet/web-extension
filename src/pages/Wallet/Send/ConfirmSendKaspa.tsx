import React, { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/navigation/BottomNav'
import ConfirmSendDetails from '@/pages/Wallet/Send/ConfirmSendDetails'
import useKaspa from '@/hooks/contexts/useKaspa'
import useSettings from '@/hooks/contexts/useSettings'
import TopNav from '@/components/navigation/TopNav'
import NextButton from '@/components/buttons/NextButton'
import ErrorMessages from '@/utils/constants/errorMessages'
import PopupMessageDialog from '@/components/messages/PopupMessageDialog'

const ConfirmSendKaspa: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token, recipient, amount, outputs, fee, feeRate } = location.state || {}
  const { request } = useKaspa()
  const { settings } = useSettings()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  const handleConfirmClick = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const [generatedTransactions] = await request('account:create', [outputs, feeRate, fee])
      if (!generatedTransactions || generatedTransactions.length === 0) {
        setError(ErrorMessages.TRANSACTION.FAILED_CREATION)
        setLoading(false)
        setShowDialog(true)
        return
      }

      const [txnId] = await request('account:submitKaspaTransaction', [generatedTransactions])
      if (!txnId) {
        setError(ErrorMessages.TRANSACTION.FAILED_SUBMISSION)
        setLoading(false)
        setShowDialog(true)
        return
      }

      navigate(`/send/${token.tick}/sent`, {
        state: { token, amount, recipient, txnId },
      })
    } catch (err) {
      console.error(ErrorMessages.TRANSACTION.CONFIRMATION_ERROR(err))
      setError(ErrorMessages.TRANSACTION.CONFIRMATION_ERROR(err))
      setLoading(false)
      setShowDialog(true)
    } finally {
      setLoading(false)
    }
  }, [request, outputs, feeRate, fee, navigate, token, amount, recipient])

  return (
    <>
      <TopNav />
      <AnimatedMain className="flex flex-col h-screen w-full fixed">
        <ConfirmSendDetails
          token={token}
          recipient={recipient}
          amount={amount}
          fee={fee}
          network={settings.nodes[settings.selectedNode].address}
          loading={loading}
        />
      </AnimatedMain>
      <div className="bottom-20 left-0 right-0 px-4 fixed">
        <NextButton onClick={handleConfirmClick} text="Confirm Send" loading={loading} />
      </div>
      <BottomNav />

      <PopupMessageDialog
        message={error}
        onClose={() => setShowDialog(false)}
        isOpen={showDialog}
        title="Error"
      />
    </>
  )
}

export default ConfirmSendKaspa
