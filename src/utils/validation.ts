import React from 'react'
import { getMintedPercentage } from '@/utils/calculations'
import { KRC20TokenResponse, TokenFromApi } from '@/utils/interfaces'

export const validateRecipient = async (
  request: Function,
  address: string,
  setRecipientError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  try {
    const isValid = await request('wallet:validate', [address])
    setRecipientError(
      isValid ? null : 'Invalid Kaspa address. Kaspa addresses should start with the kaspa: prefix.',
    )
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
  const numericValue = parseFloat(value)

  if (tokenTick === 'KASPA') {
    if (value.length === 0 || isNaN(numericValue) || numericValue <= 0) {
      setAmountError('Amount should be more than 0.')
    } else if (numericValue < 0.2) {
      setAmountError('Minimum amount to send is 0.2 KASPA.')
    } else if (numericValue > formattedBalance) {
      setAmountError(`Amount must be less than your balance of ${formattedBalance}.`)
    } else {
      setAmountError(null)
    }
  } else {
    if (isNaN(numericValue) || numericValue <= 0 || numericValue > formattedBalance) {
      setAmountError(`Amount must be more than 0 and less than ${formattedBalance}.`)
    } else {
      setAmountError(null)
    }
  }
}

export const checkIfMintable = (token: KRC20TokenResponse | TokenFromApi | null) => {
  if (!token || token.state === 'unused') return false

  const maxSupply = token.max
  const mintedPercentage = getMintedPercentage(Number(token.minted), Number(maxSupply))
  return maxSupply !== 0 && mintedPercentage < 100
}
