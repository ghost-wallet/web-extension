import { useEffect, useState } from 'react'

const useMintErrorHandling = (
  mintAmount: number,
  kaspaBalance: number,
  exceedsBalance: boolean,
  exceedsSupply: boolean,
  availableSupply: number,
) => {
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (mintAmount < 5) {
      setError(`Ghost requires a minimum of 5 KAS per mint.`)
    } else if (exceedsSupply) {
      setError(`Cannot mint more tokens than the remaining unminted supply: ${availableSupply}`)
    } else if (exceedsBalance) {
      setError(
        `You need at least ${
          mintAmount + 25 + 0.1 * mintAmount
        } Kaspa in your wallet, but you have ${kaspaBalance}. Minting requires a minimum of 25 KAS, 10% of the mint cost to cover fees, and 1 KAS per mint.`,
      )
    } else {
      setError('')
    }
  }, [mintAmount, kaspaBalance, exceedsBalance, exceedsSupply])

  return error
}

export default useMintErrorHandling
