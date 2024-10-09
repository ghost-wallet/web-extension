import { useCallback, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { i18n } from 'webextension-polyfill'
import PasswordInput from '@/components/PasswordInput'
import ErrorMessage from '@/components/ErrorMessage'
import useKaspa from '@/hooks/useKaspa'

export default function UnlockWallet() {
  const navigate = useNavigate()
  const { request } = useKaspa()

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    if (password.length >= 8) {
      setError('')
      setIsValid(true)
    } else if (password.length > 0 && password.length < 8) {
      setError('Must be at least 8 characters')
      setIsValid(false)
    }
  }, [password])

  const unlockWallet = useCallback(() => {
    request('wallet:unlock', [password])
      .then(() => {
        navigate('/')
      })
      .catch((err) => {
        setError(err.message || 'An error occurred while unlocking')
      })
  }, [password, request, navigate])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      e.preventDefault() // Prevent form submission if there is a default behavior
      unlockWallet()
    }
  }

  return (
    <main className="pt-10 px-6">
      <h1 className="text-primarytext text-3xl font-rubik text-center mb-8 mt-36">
        Enter your password
      </h1>
      <form className="flex flex-col items-center" onKeyDown={handleKeyDown}>
        <PasswordInput
          label={i18n.getMessage('password')}
          id="password"
          value={password}
          onChange={(e) => {
            if (error) setError('')
            setPassword(e.target.value)
          }}
        />
        <ErrorMessage message={error} />
      </form>
      <div className="fixed bottom-0 left-0 w-full px-6 pb-10">
        <button
          type="button"
          disabled={!isValid}
          onClick={unlockWallet}
          className={`w-full h-[52px] text-base font-lato font-semibold rounded-[25px] ${
            isValid
              ? 'bg-primary text-secondarytext cursor-pointer hover:bg-hover'
              : 'bg-secondary text-secondarytext cursor-default'
          }`}
        >
          {i18n.getMessage('unlock')}
        </button>
      </div>
    </main>
  )
}
