import React, { useState, useEffect } from 'react'
import PasswordInput from '@/components/PasswordInput'
import ErrorMessage from '@/components/ErrorMessage'

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
    <main className="pt-10 px-6">
      <h1 className="text-primarytext text-2xl font-rubik text-center mb-6 mt-36">Create password</h1>
      <form className="flex flex-col items-center">
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
    </main>
  )
}
