import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/navigation/BottomNav'
import ConfirmSendDetails from '@/pages/Wallet/Send/ConfirmSendDetails'
import useKaspa from '@/hooks/contexts/useKaspa'
import SpinnerPage from '@/components/loaders/SpinnerPage'
import { KRC20TokenRequest } from '@/utils/interfaces'
import { useQueryClient } from '@tanstack/react-query'
import useSettings from '@/hooks/contexts/useSettings'
import TopNav from '@/components/navigation/TopNav'
import NextButton from '@/components/buttons/NextButton'

const ConfirmSendKRC20: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token, recipient, amount, feeRate } = location.state || {}
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [estimatedFee, setEstimatedFee] = useState<string>('')
  const [krc20Info, setKrc20Info] = useState<KRC20TokenRequest | null>(null)
  const { request } = useKaspa()
  const { settings } = useSettings()

  const fetchEstimatedFee = useCallback(() => {
    request('account:getKRC20Info', [recipient, token, amount])
      .then((info) => {
        setKrc20Info(info)
        return request('account:estimateKRC20TransactionFee', [info, feeRate])
      })
      .then((response) => {
        setEstimatedFee(response || '')
      })
      .catch((err) => {
        setError(`Error fetching estimated fee: ${err}`)
        console.error('[ConfirmSendKRC20] error fetching estimated fee:', err)
      })
  }, [request, recipient, token, amount, feeRate])

  useEffect(() => {
    fetchEstimatedFee()

    // Update estimated fee every 7 seconds
    const intervalId = setInterval(fetchEstimatedFee, 7000)
    return () => clearInterval(intervalId)
  }, [fetchEstimatedFee])

  const queryClient = useQueryClient()

  const handleConfirmClick = useCallback(() => {
    if (!krc20Info) {
      setError('Missing token information. Please try again.')
      return
    }

    setLoading(true)
    setError('')
    request('account:submitKRC20Transaction', [krc20Info, feeRate])
      .then((response) => {
        console.log('[ConfirmSendKRC20] write inscription success. Response:', response)
        const txnId = response[1]
        navigate(`/send/${token.tick}/sent`, {
          state: { token, amount, recipient, txnId },
        })
        queryClient.invalidateQueries({ queryKey: ['krc20Tokens'] })
      })
      .catch((err) => {
        setError(`Error: ${err}`)
        console.error('[ConfirmSendKRC20] error writing inscription:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [request, krc20Info, feeRate, token, amount, recipient, navigate])

  return (
    <>
      <TopNav />
      <AnimatedMain className="flex flex-col h-screen w-full fixed">
        {loading ? (
          <SpinnerPage displayText={`Transferring ${amount.toLocaleString()} ${token.tick}...`} />
        ) : (
          <ConfirmSendDetails
            token={token}
            recipient={recipient}
            amount={amount}
            fee={estimatedFee || 'Calculating...'}
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

export default ConfirmSendKRC20
