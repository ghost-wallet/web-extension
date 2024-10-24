import React from 'react'

interface ContinueToConfirmTxnButtonProps {
  onClick: () => void
  disabled: boolean
}

const ContinueToConfirmTxnButton: React.FC<ContinueToConfirmTxnButtonProps> = ({ onClick, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-[52px] text-lg font-lato font-semibold rounded-[25px] ${
        disabled ? 'bg-secondary cursor-not-allowed' : 'bg-primary cursor-pointer hover:bg-hover'
      } text-secondarytext`}
    >
      Continue
    </button>
  )
}

export default ContinueToConfirmTxnButton
