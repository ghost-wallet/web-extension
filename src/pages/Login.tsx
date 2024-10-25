import React, { useCallback, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PasswordInput from '@/components/inputs/PasswordInput'
import ErrorMessage from '@/components/ErrorMessage'
import useKaspa from '@/hooks/contexts/useKaspa'
import ghostIcon from '../../assets/ghost.svg'
import AnimatedMain from '@/components/AnimatedMain'

export default function Login() {
  const navigate = useNavigate()
  const { request } = useKaspa()

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(false)

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

  const login = useCallback(async () => {
    try {
      const decryptedKey = await request('wallet:unlock', [password])
      if (decryptedKey) {
        console.log('Login successful')

        // TODO perform account scan in background or earlier? Do it when component is mounted?
        // TODO edge case: if not connected to node, account scan will fail and not be retried
        request('account:scan', [])
          .then(() => console.log('Account scan completed'))
          .catch((err) => console.error('Account scan error:', err))

        navigate('/')
      } else {
        setError('Failed to retrieve decrypted key')
      }
    } catch (err) {
      console.log('[Login] Password login error', err)
      setError('Incorrect password')
    }
  }, [password, request, navigate])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      e.preventDefault()
      login()
    }
  }

  const handleForgotPassword = () => {
    navigate('/unlock/forgotpassword')
  }

  return (
    <AnimatedMain showConnectingMessage={false}>
      <div className="flex justify-center mt-10">
        <img className="w-[123px] h-[123px]" src={ghostIcon} alt="logo" />
      </div>
      <h1 className="text-primarytext text-2xl font-rubik text-center mb-2 mt-14">Enter your password</h1>
      <form className="flex flex-col items-center p-6" onKeyDown={handleKeyDown}>
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

      <div className="mt-2 text-center">
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-primarytext hover:text-mutedtext underline font-lato text-base"
        >
          Forgot Password?
        </button>
      </div>

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
          Login
        </button>
      </div>
    </AnimatedMain>
  )
}
