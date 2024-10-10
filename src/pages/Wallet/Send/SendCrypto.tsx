import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import BackButton from '@/components/BackButton'
import { formatBalance } from '@/utils/formatting'

const SendCrypto: React.FC = () => {
  const location = useLocation()
  const { token } = location.state || {}

  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [recipientError, setRecipientError] = useState('')
  const [amountError, setAmountError] = useState('')

  if (!token) {
    return (
      <div>
        <p>Error: Token information is missing!</p>
      </div>
    )
  }

  const maxAmount =
    token.tick === 'KASPA'
      ? token.balance
      : formatBalance(token.balance, token.dec)

  // Validate the recipient address
  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setRecipient(value)

    if (!value.startsWith('kaspa:')) {
      setRecipientError('Address must start with kaspa:')
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

    if (parseFloat(value) > parseFloat(maxAmount)) {
      setAmountError(
        `Amount cannot exceed your available balance of ${maxAmount} ${token.tick}`,
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
        <div className="flex flex-col items-center mt-2">
          <img
            src={
              token.tick === 'KASPA'
                ? '/kaspa-kas-logo.png'
                : `https://krc20-assets.kas.fyi/icons/${token.tick}.jpg`
            }
            alt={`${token.tick} logo`}
            className="w-20 h-20 rounded-full mb-2"
          />
          <p className="text-primarytext text-base font-lato">
            {token.tick === 'KASPA'
              ? `${token.balance} ${token.tick}`
              : `${formatBalance(token.balance, token.dec)} ${token.tick}`}{' '}
            Available
          </p>
        </div>
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
          <div className="relative w-full">
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              onKeyDown={handleKeyDown}
              placeholder="Amount"
              className="w-full p-2 pr-16 border border-muted bg-transparent text-base text-primarytext placeholder-mutedtext rounded"
            />
            <button
              onClick={handleMaxClick}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-muted text-primarytext text-sm px-3 py-1 rounded hover:bg-muted-dark transition"
            >
              MAX
            </button>
          </div>

          {/* Error Messages */}
          {(recipientError || amountError) && (
            <div className="text-sm text-error mt-1">
              {recipientError || amountError}
            </div>
          )}
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}

export default SendCrypto
