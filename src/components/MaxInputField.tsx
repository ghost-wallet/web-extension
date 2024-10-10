import React, { ChangeEvent, KeyboardEvent } from 'react'

interface MaxInputFieldProps {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
  onMaxClick: () => void
  placeholder: string
}

const MaxInputField: React.FC<MaxInputFieldProps> = ({
  value,
  onChange,
  onKeyDown,
  onMaxClick,
  placeholder,
}) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full p-2 pr-16 border border-muted bg-transparent text-base text-primarytext placeholder-mutedtext rounded"
      />
      <button
        onClick={onMaxClick}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-muted text-primarytext text-sm px-3 py-1 rounded hover:bg-muted-dark transition"
      >
        MAX
      </button>
    </div>
  )
}

export default MaxInputField
