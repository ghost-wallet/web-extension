import { MAX_ALLOWED_MINTS, MIN_ALLOWED_MINTS } from '@/utils/constants/constants'

const useMintValidation = (
  mintAmount: number | null,
  totalMintCost: number,
  availableSupply: number,
  totalSupply: number,
) => {
  const isMintAmountValid =
    mintAmount !== null &&
    mintAmount >= MIN_ALLOWED_MINTS &&
    mintAmount <= MAX_ALLOWED_MINTS &&
    totalMintCost + availableSupply <= totalSupply

  return { isMintAmountValid }
}

export default useMintValidation
