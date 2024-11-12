import React from 'react'
import Spinner from '@/components/loaders/Spinner'

interface NextButtonProps {
  buttonEnabled?: boolean
  showError?: boolean
  onClick: () => void
  text?: string
  loading?: boolean
}

const NextButton: React.FC<NextButtonProps> = ({
  buttonEnabled = true,
  showError = false,
  onClick,
  text = 'Next',
  loading = false,
}) => (
  <button
    onClick={onClick}
    disabled={!buttonEnabled || showError || loading}
    className={`w-full h-[52px] text-lg font-semibold rounded-lg flex items-center justify-center ${
      buttonEnabled && !showError && !loading
        ? 'bg-primary text-secondarytext cursor-pointer hover:bg-hoverprimary'
        : 'bg-muted text-mutedtext cursor-not-allowed'
    }`}
  >
    {loading ? <Spinner /> : text}
  </button>
)

export default NextButton
