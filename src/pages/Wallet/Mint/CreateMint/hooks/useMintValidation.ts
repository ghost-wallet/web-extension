const useMintValidation = (
  mintAmount: number | null,
  totalMintCost: number,
  availableSupply: number,
  totalSupply: number,
) => {
  // TODO set consts for min and max mint amounts
  const isMintAmountValid =
    mintAmount !== null &&
    mintAmount >= 5 &&
    mintAmount <= 1000 &&
    totalMintCost + availableSupply <= totalSupply

  return { isMintAmountValid }
}

export default useMintValidation
