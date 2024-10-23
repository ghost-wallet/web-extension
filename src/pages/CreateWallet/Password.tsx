import React, { useState, useEffect } from 'react'
import PasswordInput from '@/components/PasswordInput'
import ErrorMessage from '@/components/ErrorMessage'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'

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
      setError('Must be at least 8 characters')
      setIsValid(false)
    } else if (password.length >= 8 && password !== confirmPassword && confirmPassword.length > 0) {
      setError('Passwords do not match')
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
    <AnimatedMain showConnectingMessage={false}>
      <Header title="Create Password" showBackButton={true} />
      <form className="flex flex-col items-center pt-36 px-6">
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
        {error && <ErrorMessage message={error} />}
      </form>
      <div className="fixed bottom-0 left-0 w-full px-6 pb-10">
        <button
          type="button"
          disabled={!isValid}
          onClick={handleContinueClick}
          className={`w-full h-[52px] text-base font-lato font-semibold rounded-[25px] ${
            isValid
              ? 'bg-primary text-secondarytext cursor-pointer hover:bg-hover'
              : 'bg-secondary text-secondarytext cursor-default'
          }`}
        >
          Continue
        </button>
      </div>
    </AnimatedMain>
  )
}
