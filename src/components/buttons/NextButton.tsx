import React from 'react'

interface NextButtonProps {
  buttonEnabled?: boolean
  showError?: boolean
  onClick: () => void
  text?: string
}

const NextButton: React.FC<NextButtonProps> = ({
  buttonEnabled = true,
  showError = false,
  onClick,
  text = 'Next',
}) => (
  <button
    onClick={onClick}
    disabled={!buttonEnabled || showError}
    className={`w-full h-[52px] text-lg font-semibold rounded-[25px] ${
      buttonEnabled && !showError
        ? 'bg-primary text-secondarytext cursor-pointer hover:bg-hoverprimary'
        : 'bg-muted text-mutedtext cursor-not-allowed'
    }`}
  >
    {text}
  </button>
)

export default NextButton
