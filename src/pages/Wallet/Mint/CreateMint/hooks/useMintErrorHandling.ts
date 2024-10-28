import { useEffect, useState } from 'react'

const useMintErrorHandling = (
  mintAmount: number | null,
  kaspaBalance: number,
  exceedsBalance: boolean,
  exceedsSupply: boolean,
  availableSupply: number,
) => {
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (exceedsSupply) {
      setError(`Cannot mint more tokens than the remaining unminted supply: ${availableSupply}`)
    } else if (exceedsBalance) {
      setError(`Not enough Kaspa in wallet.`)
    } else {
      setError('')
    }
  }, [mintAmount, kaspaBalance, exceedsBalance, exceedsSupply])

  return error
}

export default useMintErrorHandling
