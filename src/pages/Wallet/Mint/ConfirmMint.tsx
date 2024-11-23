import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import { KRC20TokenResponse } from '@/utils/interfaces'
import useKaspa from '@/hooks/contexts/useKaspa'
import CryptoImage from '@/components/CryptoImage'
import NextButton from '@/components/buttons/NextButton'
import TotalCostToMint from '@/pages/Wallet/Mint/TotalCostToMint'
import { postMint } from '@/hooks/ghost/useMint'
import ErrorMessages from '@/utils/constants/errorMessages'
import BottomFixedContainer from '@/components/containers/BottomFixedContainer'
import PopupMessageDialog from '@/components/messages/PopupMessageDialog'

export default function ConfirmMint() {
  const location = useLocation()
  const navigate = useNavigate()
  const { kaspa, request } = useKaspa()

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

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
      navigate(`/mint/${token.tick}/review/minted`, {
        state: { token, receiveAmount, payAmount, scriptAddress },
      })
      setLoading(false)
    } catch (err: any) {
      setLoading(false)
      setError(err.toString())
      setShowDialog(true)
      console.error('Error posting to Mint API:', err)
    }
  }

  return (
    <>
      <AnimatedMain className="flex flex-col h-screen fixed w-full">
        <Header title={`Mint ${token.tick}`} showBackButton={true} />
        <div className="flex flex-col px-4 pb-2">
          <CryptoImage ticker={token.tick} size="large" />
          <div className="w-full space-y-1 pt-2">
            <div className="flex justify-between">
              <span className="text-mutedtext text-base">Receive amount</span>
              <span className="text-mutedtext text-base text-right">
                {receiveAmount.toLocaleString()} {token.tick}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-mutedtext text-base">Pay amount</span>
              <span className="text-mutedtext text-base text-right">{payAmount?.toLocaleString()} KAS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mutedtext text-base">Network fee</span>
              <span className="text-mutedtext text-base text-right">{networkFee} KAS</span>
            </div>

            <TotalCostToMint totalFees={totalCost} />
          </div>
        </div>
      </AnimatedMain>
      {kaspa.connected && (
        <BottomFixedContainer className="p-4 bg-bgdark border-t border-darkmuted ">
          <NextButton onClick={handleMint} text="Confirm Mint" loading={loading} />
        </BottomFixedContainer>
      )}
      <PopupMessageDialog
        message={error}
        onClose={() => setShowDialog(false)}
        isOpen={showDialog}
        title="Error"
      />
    </>
  )
}
