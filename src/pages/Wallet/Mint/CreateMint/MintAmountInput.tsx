import React from 'react'

interface MintAmountInputProps {
  mintAmount: number | null
  onSliderChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const MintAmountInput: React.FC<MintAmountInputProps> = ({ mintAmount, onSliderChange, onInputChange }) => (
  <div className="flex items-center space-x-4 pt-4">
    <input
      type="range"
      min="0"
      max="1000"
      value={mintAmount || 0}
      onChange={onSliderChange}
      className="w-full cursor-pointer accent-primary h-2"
    />
    <input
      type="number"
      min="0"
      max="1000"
      value={mintAmount !== null ? mintAmount : ''}
      onChange={onInputChange}
      className="w-30 bg-darkmuted p-2 border border-muted rounded-lg font-lato text-lg text-primarytext text-center"
      placeholder="KAS"
    />
  </div>
)

export default MintAmountInput
