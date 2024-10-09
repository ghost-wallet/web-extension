import { useState, useEffect } from 'react'
import PasswordInput from '@/components/PasswordInput'
import ErrorMessage from '@/components/ErrorMessage'

export default function Password({
  onPasswordSet,
}: {
  onPasswordSet: (password: string) => void
}) {
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isValid, setIsValid] = useState<boolean>(false)

  useEffect(() => {
    if (password.length > 0 && password.length < 8) {
      setError('Must be at least 8 characters')
      setIsValid(false)
    } else if (
      password.length >= 8 &&
      password !== confirmPassword &&
      confirmPassword.length > 0
    ) {
      setError('Passwords do not match')
      setIsValid(false)
    } else if (password.length >= 8 && password === confirmPassword) {
      setError('')
      setIsValid(true)
    } else if (password.length >= 8 && confirmPassword.length === 0) {
      setError('')
      setIsValid(false)
    }
  }, [password, confirmPassword])

  return (
    <main className="pt-10 px-6">
      <h1 className="text-primarytext text-3xl font-rubik text-center mb-32">
        Create Password
      </h1>
      <form className="flex flex-col items-center">
        <PasswordInput
          label="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordInput
          label="Confirm password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <ErrorMessage message={error} />
      </form>
      <div className="fixed bottom-0 left-0 w-full px-6 pb-10">
        <button
          type="button"
          disabled={!isValid}
          onClick={() => {
            onPasswordSet(password)
          }}
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
