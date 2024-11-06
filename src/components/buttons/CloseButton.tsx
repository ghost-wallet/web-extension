import React from 'react'

interface NextButtonProps {
  buttonEnabled?: boolean
  showError?: boolean
  onClick: () => void
  text?: string
}

const CloseButton: React.FC<NextButtonProps> = ({ onClick, text = 'Close' }) => (
  <button
    onClick={onClick}
    className="w-full h-[52px] text-lg text-primarytext hover:bg-muted font-semibold rounded-lg bg-slightmuted"
  >
    {text}
  </button>
)

export default CloseButton
