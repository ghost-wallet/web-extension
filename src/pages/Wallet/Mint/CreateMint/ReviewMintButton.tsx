import React from 'react'

interface MintButtonProps {
  isMintAmountValid: boolean
  showError: boolean
  onClick: () => void
}

const ReviewMintButton: React.FC<MintButtonProps> = ({ isMintAmountValid, showError, onClick }) => (
  <button
    onClick={onClick}
    disabled={!isMintAmountValid || showError}
    className={`w-full h-[52px] text-lg font-lato font-semibold rounded-[25px] ${
      isMintAmountValid && !showError
        ? 'bg-primary text-secondarytext cursor-pointer hover:bg-hover'
        : 'bg-muted text-mutedtext cursor-not-allowed'
    }`}
  >
    Next
  </button>
)

export default ReviewMintButton
