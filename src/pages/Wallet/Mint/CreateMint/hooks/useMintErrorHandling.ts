import { useEffect, useState } from 'react'
import ErrorMessages from '@/utils/constants/errorMessages'

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
    // TODO set min and max mint amount const numbers
    if (mintAmount === null) {
      setError(ErrorMessages.MINT.REQUIRED_AMOUNT)
    } else if (mintAmount < 5) {
      setError(ErrorMessages.MINT.MINIMUM_AMOUNT)
    } else if (mintAmount > 1000) {
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
