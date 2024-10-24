import React from 'react'

interface AmountInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onMaxClick: () => void
}

const AmountInput: React.FC<AmountInputProps> = ({ value, onChange, onMaxClick }) => (
  <div className="relative w-full">
    <input
      type="number"
      value={value}
      onChange={onChange}
      placeholder="Amount"
      className="w-full p-3 pr-20 border border-slightmuted bg-bgdarker text-base text-primarytext placeholder-mutedtext rounded"
    />
    <button
      type="button"
      onClick={onMaxClick}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primarytext font-lato text-base bg-slightmuted hover:bg-muted rounded-[10px] px-2 py-1"
    >
      Max
    </button>
  </div>
)

export default AmountInput
