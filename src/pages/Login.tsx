import React, { useCallback, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PasswordInput from '@/components/PasswordInput'
import ErrorMessage from '@/components/ErrorMessage'
import useKaspa from '@/hooks/useKaspa'
import ghostIcon from '../../assets/ghost.svg'

export default function Login() {
  const navigate = useNavigate()
  const { request } = useKaspa()

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(false)

  // TODO: If node not connected, and user tries to login, show error Kaspa not connected to node
  // TODO: please try again. Add in here node connection or kaspa context
  useEffect(() => {
    if (password.length >= 8) {
      setIsValid(true)
    } else {
      setIsValid(false)
    }
    if (password.length >= 8 && error === 'Must be at least 8 characters') {
      setError('')
    }
  }, [password, error])

  const login = useCallback(() => {
    request('wallet:unlock', [password])
      .then((decryptedKey: string) => {
        if (decryptedKey) {
          navigate('/')
        } else {
          setError('Failed to retrieve decrypted key')
        }
      })
      .catch((err) => {
        console.log('Password login error', err)
        setError(`Error: ${err}`)
      })
  }, [password, request, navigate])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      e.preventDefault() // Prevent form submission if there is a default behavior
      login()
    }
  }

  return (
    <main className="pt-10 px-6">
      <div className="flex justify-center mt-7">
        <img className="w-[123px] h-[123px]" src={ghostIcon} alt="logo" />
      </div>
      <h1 className="text-primarytext text-2xl font-rubik text-center mb-4 mt-14">Enter your password</h1>
      <form className="flex flex-col items-center" onKeyDown={handleKeyDown}>
        <PasswordInput
          placeholder="Password"
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
          onClick={login}
          className={`w-full h-[52px] text-base font-lato font-semibold rounded-[25px] ${
            isValid
              ? 'bg-primary text-secondarytext cursor-pointer hover:bg-hover'
              : 'bg-secondary text-secondarytext cursor-default'
          }`}
        >
          Unlock
        </button>
      </div>
    </main>
  )
}
