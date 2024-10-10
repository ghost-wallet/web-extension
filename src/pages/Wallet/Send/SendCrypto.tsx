import React from 'react'
import { useLocation } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import BackButton from '@/components/BackButton'
import { formatBalance } from '@/utils/formatting'
import TokenDetails from '@/components/TokenDetails'
import MaxInputField from '@/components/MaxInputField'
import InputField from '@/components/InputField'
import { useInputValidation } from '@/hooks/useInputValidation'

const SendCrypto: React.FC = () => {
  const location = useLocation()
  const { token } = location.state || {}

  if (!token || !token.tick || !token.balance || !token.dec) {
    return <div>Token information is missing or incomplete.</div>
  }

  const maxAmount = token.tick === 'KASPA' ? token.balance : formatBalance(token.balance, token.dec)

  const {
    recipient,
    amount,
    recipientError,
    amountError,
    handleRecipientChange,
    handleAmountChange,
    handleKeyDown,
  } = useInputValidation(parseFloat(maxAmount), token.dec)

  // Function to handle setting the max amount
  const handleMaxClick = () => {
    handleAmountChange({
      target: { value: maxAmount.toString() }, // Convert maxAmount to a string
    } as React.ChangeEvent<HTMLInputElement>)
  }

  const isValid =
    recipient.startsWith('kaspa:') &&
    parseFloat(amount) > 0 &&
    parseFloat(amount) <= parseFloat(maxAmount) &&
    !recipientError &&
    !amountError

  return (
    <>
      <AnimatedMain>
        <div className="flex items-center justify-between mb-4 p-6">
          <BackButton />
          <h1 className="text-primarytext text-3xl font-rubik text-center flex-grow">
            Send {token.tick}
          </h1>
          <div className="w-6" />
        </div>

        <TokenDetails token={token} />

        <div className="flex flex-col items-center space-y-4 p-4">
          <InputField
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="Recipient's Kaspa Address"
          />

          <MaxInputField
            value={amount}
            onChange={handleAmountChange}
            onKeyDown={handleKeyDown}
            onMaxClick={handleMaxClick}
            placeholder="Amount"
            maxValue={parseFloat(maxAmount)} // Pass the correct max value as a number
          />

          {/* Fixed height for the error container */}
          <div className="min-h-[24px] mt-1 flex items-center justify-center">
            {(recipientError || amountError) && (
              <div className="text-sm text-error">{recipientError || amountError}</div>
            )}
          </div>
        </div>

        <div className="px-6 pt-6">
          <button
            type="button"
            disabled={!isValid}
            className={`w-full h-[52px] text-lg font-lato font-semibold rounded-[25px] ${
              isValid
                ? 'bg-primary text-secondarytext cursor-pointer hover:bg-hover'
                : 'bg-secondary text-secondarytext cursor-default'
            }`}
          >
            Send
          </button>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}

export default SendCrypto
