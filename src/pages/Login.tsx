import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PasswordInput from '@/components/inputs/PasswordInput'
import ErrorMessage from '@/components/messages/ErrorMessage'
import useKaspa from '@/hooks/contexts/useKaspa'
import ghostIcon from '../../assets/ghost.svg'
import AnimatedMain from '@/components/AnimatedMain'
import NextButton from '@/components/buttons/NextButton'
import ErrorMessages from '@/utils/constants/errorMessages'

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
      <div className="flex justify-center pt-6">
        <img className="w-[7.7rem] h-[7.7rem]" src={ghostIcon} alt="logo" />
      </div>

      <div className="flex flex-col items-center justify-center flex-grow px-6">
        <h1 className="text-primarytext text-3xl font-rubik text-center mb-6">Enter your password</h1>
        <form className="flex flex-col items-center w-full" onKeyDown={handleKeyDown}>
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
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-mutedtext hover:underline text-lg font-light mt-2 mb-10"
          >
            Forgot Password
          </button>
        </form>
      </div>

      <div className="w-full px-4 pb-10">
        <NextButton onClick={login} text={'Login'} />
      </div>
    </AnimatedMain>
  )
}
