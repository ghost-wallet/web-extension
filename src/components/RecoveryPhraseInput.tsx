import React from 'react'

interface RecoveryPhraseInputProps {
  value: string
  onChange: (value: string) => void
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void
  disabled?: boolean
  index: number
}

const RecoveryPhraseInput: React.FC<RecoveryPhraseInputProps> = ({
  value,
  onChange,
  onPaste,
  disabled = false,
  index,
}) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onPaste={onPaste}
    disabled={disabled}
    className="bg-bgdarker border border-muted rounded px-2 text-primarytext text-sm focus:outline-none w-full h-8"
    tabIndex={index + 1}
  />
)

export default RecoveryPhraseInput
