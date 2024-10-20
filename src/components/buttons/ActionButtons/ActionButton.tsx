import React from 'react'

interface ActionButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

export default function ActionButton({ icon, label, onClick }: ActionButtonProps) {
  return (
    <button className="flex flex-col items-center justify-center group" onClick={onClick}>
      <div className="flex flex-col items-center justify-center w-16 h-16 bg-darkmuted hover:bg-slightmuted rounded-lg transition">
        {/* Icon and label stacked vertically */}
        <div className="h-6 w-6 text-primary">{icon}</div>
        <span className="text-mutedtext text-xs font-lato transition group-hover:text-primary mt-1">
          {label}
        </span>
      </div>
    </button>
  )
}
