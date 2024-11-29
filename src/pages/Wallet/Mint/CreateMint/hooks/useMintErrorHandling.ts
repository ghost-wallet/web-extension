import { useEffect, useState } from 'react'
import ErrorMessages from '@/utils/constants/errorMessages'
import { MAX_ALLOWED_MINTS, MIN_ALLOWED_MINTS } from '@/utils/constants/constants'

const useMintErrorHandling = (
  mintAmount: number | null,
  kaspaBalance: number,
  kaspaConnected: boolean,
  exceedsBalance: boolean,
  exceedsSupply: boolean,
  availableSupply: number,
) => {
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (mintAmount === null) {
      setError(ErrorMessages.MINT.MINIMUM_AMOUNT)
    } else if (mintAmount < MIN_ALLOWED_MINTS) {
      setError(ErrorMessages.MINT.MINIMUM_AMOUNT)
    } else if (mintAmount > MAX_ALLOWED_MINTS) {
      setError(ErrorMessages.MINT.MAXIMUM_AMOUNT)
    } else if (exceedsSupply) {
      setError(ErrorMessages.MINT.EXCEEDS_SUPPLY(availableSupply))
    } else if (!kaspaConnected) {
      setError(ErrorMessages.NETWORK.NOT_CONNECTED)
    } else if (exceedsBalance) {
      setError(ErrorMessages.MINT.EXCEEDS_BALANCE(mintAmount, kaspaBalance))
    } else {
      setError('')
    }
  }, [mintAmount, kaspaBalance, kaspaConnected, exceedsBalance, exceedsSupply, availableSupply])

  return error
}

export default useMintErrorHandling
