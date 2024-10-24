import React, { ChangeEvent } from 'react'

interface PasswordInputProps {
  id: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

const PasswordInput: React.FC<PasswordInputProps> = ({ id, value, onChange, placeholder = '' }) => {
  return (
    <div className="w-full mb-4">
      <input
        type="password"
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border border-muted bg-transparent text-base text-primarytext placeholder-mutedtext rounded"
      />
    </div>
  )
}

export default PasswordInput