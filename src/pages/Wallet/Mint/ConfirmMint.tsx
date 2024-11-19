import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BottomNav from '@/components/navigation/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import { KRC20TokenResponse } from '@/utils/interfaces'
import useKaspa from '@/hooks/contexts/useKaspa'
import CryptoImage from '@/components/CryptoImage'
import NextButton from '@/components/buttons/NextButton'
import TotalCostToMint from '@/pages/Wallet/Mint/TotalCostToMint'
import TopNav from '@/components/navigation/TopNav'
import { postMint } from '@/hooks/ghost/useMint'
import ErrorMessages from '@/utils/constants/errorMessages'
import ErrorMessage from '@/components/messages/ErrorMessage'
import useSettings from '@/hooks/contexts/useSettings'

export default function ConfirmMint() {
  const location = useLocation()
  const navigate = useNavigate()
  const { kaspa, request } = useKaspa()
  const { settings } = useSettings()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { token, payAmount, receiveAmount, feeRate } = location.state as {
    token: KRC20TokenResponse
    payAmount: number
    receiveAmount: number
    feeRate: number
  }
  const networkFee = parseFloat((payAmount * 0.1).toFixed(2))
  const totalCost = (networkFee + payAmount).toString()

  const handleMint = async () => {
    setLoading(true)
    const mintRequest = {
      tick: token.tick,
      timesToMint: payAmount,
      address: kaspa.addresses[0],
    }

    try {
      const response = await postMint(mintRequest)
      const { scriptAddress } = response
      const outputs: [string, string][] = [[scriptAddress, totalCost]]

      const [generatedTransactions] = await request('account:create', [outputs, feeRate, '0'])
      if (!generatedTransactions || generatedTransactions.length === 0) {
        setError(ErrorMessages.TRANSACTION.FAILED_CREATION)
        setLoading(false)
        return
      }

      const [txnId] = await request('account:submitKaspaTransaction', [generatedTransactions])
      if (!txnId) {
        setError(ErrorMessages.TRANSACTION.FAILED_SUBMISSION)
        setLoading(false)
        return
      }
      navigate(`/mint/${token.tick}/review/minted`, {
        state: { token, receiveAmount, payAmount, scriptAddress },
      })
      setLoading(false)
    } catch (err: any) {
      setLoading(false)
      setError(err.toString())
      console.error('Error using Mint API:', err)
    }
  }

  return (
    <>
      <TopNav />
      <AnimatedMain className="flex flex-col h-screen fixed w-full">
        <Header title="Confirm Mint" showBackButton={true} />
        <div className="flex flex-col px-4 pb-2">
          <CryptoImage ticker={token.tick} size="large" />
          <div className="w-full space-y-1 pt-2">
            <div className="flex justify-between">
              <span className="text-mutedtext text-base">Receive amount</span>
              <span className="text-mutedtext text-base text-right">
                {receiveAmount.toLocaleString()}{' '}
                {token.tick}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-mutedtext text-base">Pay amount</span>
              <span className="text-mutedtext text-base text-right">
                {payAmount?.toLocaleString(undefined, {
                  style: 'currency',
                  currency: settings.currency,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                KAS
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-mutedtext text-base">Network fee</span>
              <span className="text-mutedtext text-base text-right">{networkFee} KAS</span>
            </div>

            <TotalCostToMint totalFees={totalCost} />
          </div>
        </div>
        <ErrorMessage message={error || ''} className="h-6 mb-4 mt-2 flex justify-center items-center px-4" />
      </AnimatedMain>
      <div className="fixed bottom-20 left-0 right-0 px-4">
        <NextButton onClick={handleMint} text="Confirm Mint" loading={loading} />
      </div>
      <BottomNav />
    </>
  )
}
