const useMintValidation = (
  mintAmount: number | null,
  totalMintCost: number,
  availableSupply: number,
  totalSupply: number,
) => {
  const isMintAmountValid =
    mintAmount !== null &&
    mintAmount >= 1 &&
    mintAmount <= 10000 &&
    totalMintCost + availableSupply <= totalSupply

  return { isMintAmountValid }
}

export default useMintValidation
