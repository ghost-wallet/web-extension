import React, { useState, useEffect } from 'react'
import PasswordInput from '@/components/inputs/PasswordInput'
import ErrorMessage from '@/components/messages/ErrorMessage'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import NextButton from '@/components/buttons/NextButton'
import ErrorMessages from '@/utils/constants/errorMessages'

interface PasswordProps {
  onPasswordSet: (password: string) => void
}

export default function Password({ onPasswordSet }: PasswordProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    validatePasswords(password, confirmPassword)
  }, [password, confirmPassword])

  const validatePasswords = (password: string, confirmPassword: string) => {
    if (password.length > 0 && password.length < 8) {
      setError(ErrorMessages.PASSWORD.TOO_SHORT)
      setIsValid(false)
    } else if (password.length >= 8 && password !== confirmPassword && confirmPassword.length > 0) {
      setError(ErrorMessages.PASSWORD.MISMATCH)
      setIsValid(false)
    } else if (password.length >= 8 && password === confirmPassword) {
      setError('')
      setIsValid(true)
    } else {
      setError('')
      setIsValid(false)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
  }

  const handleContinueClick = () => {
    if (isValid) {
      onPasswordSet(password)
    }
  }

  return (
    <AnimatedMain showConnectingMessage={false} className="flex flex-col h-screen pt-5">
      <Header title="Create Password" showBackButton={true} />

      <div className="flex flex-col items-center flex-grow justify-center px-4 space-y-4">
        <PasswordInput
          id="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter password"
        />
        <PasswordInput
          id="confirm-password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder="Confirm password"
        />

        <div className="h-6">
          {error && (
            <ErrorMessage message={error} className="h-6 mb-4 mt-2 flex justify-center items-center" />
          )}
        </div>
      </div>

      <div className="w-full px-4 pb-10">
        <NextButton onClick={handleContinueClick} buttonEnabled={isValid} />
      </div>
    </AnimatedMain>
  )
}
