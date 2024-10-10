import React, { useState } from 'react'

export const useInputValidation = (maxAmount: number, decimals: number) => {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [recipientError, setRecipientError] = useState('')
  const [amountError, setAmountError] = useState('')

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setRecipient(value)

    if (!value.startsWith('kaspa:')) {
      setRecipientError('Invalid Kaspa address')
    } else {
      setRecipientError('')
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.replace(/[^0-9.]/g, '')

    const parts = value.split('.')
    if (parts.length > 2) {
      setAmountError(`Invalid amount format`)
      return
    }

    if (parts[1]?.length > decimals) {
      value = `${parts[0]}.${parts[1].slice(0, decimals)}`
    }

    setAmount(value)

    if (parseFloat(value) <= 0 || parseFloat(value) > maxAmount) {
      setAmountError(
        `Amount must be greater than 0 and not exceed ${maxAmount}`,
      )
    } else {
      setAmountError('')
    }
  }

  // Handle the key down event for input validation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ]

    if (!/[\d.]/.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault()
    }

    if (e.key === '.' && amount.includes('.')) {
      e.preventDefault()
    }
  }

  return {
    recipient,
    amount,
    recipientError,
    amountError,
    handleRecipientChange,
    handleAmountChange,
    handleKeyDown, // Make sure this is returned
  }
}
