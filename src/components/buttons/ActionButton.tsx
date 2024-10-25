import React from 'react'

interface ActionButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
  className?: string // New prop for custom class names
}

export default function ActionButton({
  icon,
  label,
  onClick,
  disabled = false,
  className = '',
}: ActionButtonProps) {
  return (
    <button
      className={`flex flex-col items-center justify-center group ${className} ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      }`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      <div
        className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition ${
          disabled ? 'bg-darkmuted' : 'bg-darkmuted hover:bg-slightmuted'
        }`}
      >
        <div className={`h-6 w-6 ${disabled ? 'text-mutedtext' : 'text-primary'}`}>{icon}</div>
        <span
          className={`text-xs font-lato mt-1 transition ${
            disabled ? 'text-mutedtext' : 'text-mutedtext group-hover:text-primary'
          }`}
        >
          {label}
        </span>
      </div>
    </button>
  )
}
