import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PasswordInput from '@/components/inputs/PasswordInput'
import ErrorMessage from '@/components/messages/ErrorMessage'
import useKaspa from '@/hooks/contexts/useKaspa'
import AnimatedMain from '@/components/AnimatedMain'
import NextButton from '@/components/buttons/NextButton'
import ErrorMessages from '@/utils/constants/errorMessages'
import AnimatedGhostLogo from '@/components/animations/AnimatedGhostLogo'

export default function Login() {
  const navigate = useNavigate()
  const { request } = useKaspa()

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const login = useCallback(async () => {
    try {
      const decryptedKey = await request('wallet:unlock', [password])
      if (decryptedKey) {
        navigate('/')
      } else {
        setError(ErrorMessages.LOGIN.FAILED_DECRYPTION)
      }
    } catch (err) {
      setError(ErrorMessages.PASSWORD.INCORRECT)
    }
  }, [password, request, navigate])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      login()
    }
  }

  const handleForgotPassword = () => {
    navigate('/unlock/forgotpassword')
  }

  return (
    <AnimatedMain className="flex flex-col h-screen">
      <h1 className="text-muted text-4xl font-rubik font-bold text-center pt-8">GHOST</h1>
      <div className="flex justify-center pt-14">
        <AnimatedGhostLogo />
      </div>

      <div className="flex flex-col items-center justify-center flex-grow px-4 pt-8">
        <h1 className="text-primarytext text-2xl font-rubik text-center mb-4">Enter your password</h1>
        <form className="flex flex-col items-center w-full" onKeyDown={handleKeyDown}>
          <PasswordInput
            placeholder="Password"
            id="password"
            value={password}
            onChange={(e) => {
              if (error) setError('')
              setPassword(e.target.value)
            }}
            isError={error !== ''}
          />
          <ErrorMessage message={error} className="h-6 mb-4 mt-2 flex justify-center items-center" />
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-lightmuted hover:underline text-lg mt-2 mb-8"
          >
            Forgot Password
          </button>
        </form>
      </div>

      <div className="w-full px-4 pb-4">
        <NextButton onClick={login} text={'Login'} />
      </div>
    </AnimatedMain>
  )
}
