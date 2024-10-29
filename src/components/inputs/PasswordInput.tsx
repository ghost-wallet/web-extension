import React, { ChangeEvent } from 'react'

interface PasswordInputProps {
  id: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  isValid: boolean
}

const PasswordInput: React.FC<PasswordInputProps> = ({ id, value, onChange, placeholder = '', isValid }) => {
  return (
    <div className="w-full">
      <input
        type="password"
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-2 border ${!isValid ? 'border-error' : 'border-muted'} h-[52px] bg-transparent text-base text-primarytext placeholder-mutedtext rounded`}
      />
    </div>
  )
}

export default PasswordInput
