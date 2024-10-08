import React from 'react'

interface PasswordInputProps {
  label: string
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  id,
  value,
  onChange,
}) => {
  return (
    <div className="w-full mb-6">
      <label
        className="block text-mutedtext text-base font-lato mb-2"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        type="password"
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 text-2xl bg-bgdarker text-mutedtext border border-muted rounded-lg focus:outline-none focus:border-secondary"
        minLength={8}
        required
      />
    </div>
  )
}

export default PasswordInput
