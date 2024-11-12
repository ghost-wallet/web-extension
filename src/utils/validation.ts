import React from 'react'
import { getMintedPercentage } from '@/utils/calculations'
import { KRC20TokenResponse, TokenFromApi } from '@/utils/interfaces'
import ErrorMessages from '@/utils/constants/errorMessages'

export const validateRecipient = async (
  request: Function,
  recipientAddress: string,
  yourAddress: string,
  isKaspa: boolean | undefined,
  setRecipientError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  if (!isKaspa && recipientAddress === yourAddress) {
    setRecipientError(ErrorMessages.KRC20.INVALID_RECIPIENT)
    return
  }
  try {
    const isValid = await request('wallet:validate', [recipientAddress])
    setRecipientError(isValid ? null : ErrorMessages.KASPA.INVALID_RECIPIENT_ADDRESS)
  } catch (err) {
    console.error(ErrorMessages.KASPA.ADDRESS_VALIDATION_ERROR(err))
    setRecipientError(ErrorMessages.KASPA.ADDRESS_VALIDATION_ERROR(err))
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
      setAmountError(ErrorMessages.SEND_AMOUNT.MORE_THAN_ZERO)
    } else if (numericValue < 0.2) {
      setAmountError(ErrorMessages.SEND_AMOUNT.MINIMUM_KASPA)
    } else if (numericValue > formattedBalance) {
      setAmountError(ErrorMessages.SEND_AMOUNT.EXCEEDS_BALANCE(formattedBalance))
    } else {
      setAmountError(null)
    }
  } else {
    if (isNaN(numericValue) || numericValue <= 0 || numericValue > formattedBalance) {
      setAmountError(ErrorMessages.SEND_AMOUNT.GENERAL(formattedBalance))
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
