export const getMintedPercentage = (minted: number, max: number): string => {
  if (max === 0) return '0'
  return ((minted / max) * 100).toFixed(2)
}
