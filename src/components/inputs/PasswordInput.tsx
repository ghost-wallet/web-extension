import React, { ChangeEvent } from 'react'

interface PasswordInputProps {
  id: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

const PasswordInput: React.FC<PasswordInputProps> = ({ id, value, onChange, placeholder = '' }) => {
  return (
    <div className="w-full my-2">
      <input
        type="password"
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-2 pl-4 border border-slightmuted h-[52px] bg-bgdarker text-lg text-primarytext placeholder-muted rounded`}
      />
    </div>
  )
}

export default PasswordInput
