import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import BackButton from '@/components/BackButton'
import { formatBalance } from '@/utils/formatting'
import TokenDetails from '@/components/TokenDetails'
import MaxInputField from '@/components/MaxInputField'

const SendCrypto: React.FC = () => {
  const location = useLocation()
  const { token } = location.state || {}

  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [recipientError, setRecipientError] = useState('')
  const [amountError, setAmountError] = useState('')

  const maxAmount =
    token.tick === 'KASPA'
      ? token.balance
      : formatBalance(token.balance, token.dec)

  // Validate the recipient address
  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setRecipient(value)

    if (!value.startsWith('kaspa:')) {
      setRecipientError('Invalid Kaspa address')
    } else {
      setRecipientError('')
    }
  }

  // Validate the amount
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.replace(/[^0-9.]/g, '')

    const parts = value.split('.')
    if (parts.length > 2) {
      setAmountError(`Invalid amount format`)
      return
    }

    if (parts[1]?.length > token.dec) {
      value = `${parts[0]}.${parts[1].slice(0, token.dec)}`
    }

    setAmount(value)

    if (parseFloat(value) <= 0 || parseFloat(value) > parseFloat(maxAmount)) {
      setAmountError(
        `Amount must be greater than 0 and not exceed ${maxAmount} ${token.tick}`,
      )
    } else {
      setAmountError('')
    }
  }

  // Only allow numbers, a single decimal point, and control keys in the amount input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ]

    if (!/[\d.]/.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault()
    }

    if (e.key === '.' && amount.includes('.')) {
      e.preventDefault()
    }
  }

  // Set the amount to max value when MAX is clicked
  const handleMaxClick = () => {
    setAmount(maxAmount)
    setAmountError('')
  }

  // Check if the form is valid
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
          {/* Recipient Address Input */}
          <input
            type="text"
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="Recipient's Kaspa Address"
            className="w-full p-2 border border-muted bg-transparent text-base text-primarytext placeholder-mutedtext rounded"
          />

          {/* Amount Input with MAX button */}
          <MaxInputField
            value={amount}
            onChange={handleAmountChange}
            onKeyDown={handleKeyDown}
            onMaxClick={handleMaxClick}
            placeholder="Amount"
          />

          {/* Error Messages */}
          <div className="min-h-[24px] mt-1">
            {(recipientError || amountError) && (
              <div className="text-sm text-error">
                {recipientError || amountError}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pt-4">
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
