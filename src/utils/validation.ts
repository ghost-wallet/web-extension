import React from 'react'

export const validateRecipient = async (
  request: Function,
  address: string,
  setRecipientError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  try {
    const isValid = await request('wallet:validate', [address])
    setRecipientError(isValid ? null : 'Invalid Kaspa address')
  } catch (err) {
    console.error('Error validating address:', err)
    setRecipientError('Error validating address.')
  }
}

export const validateAmountToSend = (
  tokenTick: string,
  value: string,
  formattedBalance: number,
  setAmountError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  if (tokenTick === 'KASPA') {
    if (value.length === 0 || parseFloat(value) <= 0) {
      setAmountError('Amount should be more than 0.')
    } else {
      setAmountError(null)
    }
  } else {
    const numericValue = parseFloat(value)
    if (isNaN(numericValue) || numericValue <= 0 || numericValue > formattedBalance) {
      setAmountError(`Amount must be more than 0 and less than ${formattedBalance}`)
    } else {
      setAmountError(null)
    }
  }
}
