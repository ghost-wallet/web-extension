import React from 'react'

interface ActionButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
}

export default function WalletActionButton({ icon, label, onClick, disabled = false }: ActionButtonProps) {
  return (
    <button
      className={`flex flex-col items-center justify-center group ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      <div
        className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition ${
          disabled ? 'bg-darkmuted' : 'bg-darkmuted hover:bg-slightmuted'
        }`}
      >
        <div className="h-6 w-6 text-primary">{icon}</div>
        <span className="text-mutedtext text-xs font-lato transition group-hover:text-primary mt-1">
          {label}
        </span>
      </div>
    </button>
  )
}
