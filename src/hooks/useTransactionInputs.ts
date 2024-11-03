import { useState } from 'react'
import { validateRecipient, validateAmountToSend } from '@/utils/validation'

export const useTransactionInputs = (token: any, maxAmount: string, yourAddress: string) => {
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
    const decimalPlaces = value.split('.')[1]?.length || 0
    if (decimalPlaces > token.dec) return

    if (value.startsWith('.') && value.length > 1) {
      value = `0${value}`
    }

    setOutputs((prevOutputs) => {
      const newOutputs = [...prevOutputs]
      newOutputs[0][1] = value
      return newOutputs
    })

    validateAmountToSend(token.tick, value, parseFloat(maxAmount), setAmountError)
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
