import { useState } from 'react'
import { validateRecipient, validateAmountToSend } from '@/utils/validation'
import { truncateDecimals } from '@/utils/formatting'
import { AccountToken } from '@/types/interfaces'

export const useTransactionInputs = (token: AccountToken, maxAmount: number, yourAddress: string) => {
  const [outputs, setOutputs] = useState<[string, string][]>([['', '']])
  const [recipientError, setRecipientError] = useState<string | null>(null)
  const [amountError, setAmountError] = useState<string | null>(null)

  const handleRecipientChange = (recipientAddress: string, request: any) => {
    setOutputs((prevOutputs) => {
      const newOutputs = [...prevOutputs]
      newOutputs[0][0] = recipientAddress
      return newOutputs
    })

    validateRecipient(request, recipientAddress, yourAddress, token.isKaspa, setRecipientError)
  }

  const handleAmountChange = (value: string) => {
    const truncatedValue = truncateDecimals(value, Number(token.dec))
    setOutputs((prevOutputs) => {
      const newOutputs = [...prevOutputs]
      newOutputs[0][1] = truncatedValue
      return newOutputs
    })

    validateAmountToSend(token.tick, truncatedValue, maxAmount, setAmountError)
  }

  const handleMaxClick = () => {
    setOutputs((prevOutputs) => {
      const newOutputs = [...prevOutputs]
      newOutputs[0][1] = maxAmount.toString()
      return newOutputs
    })
    setAmountError(null)
  }

  return {
    outputs,
    recipientError,
    amountError,
    handleRecipientChange,
    handleAmountChange,
    handleMaxClick,
  }
}
