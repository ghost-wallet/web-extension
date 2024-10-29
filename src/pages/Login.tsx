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
  const [isValid, setIsValid] = useState(true)

  const login = useCallback(async () => {
    try {
      const decryptedKey = await request('wallet:unlock', [password])
      if (decryptedKey) {
        navigate('/')
      } else {
        setError('Failed to get decrypted key')
        setIsValid(false)
      }
    } catch (err) {
      console.log('[Login] Password login error', err)
      setError('Incorrect password')
      setIsValid(false)
    }
  }, [password, request, navigate, isValid])

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
    <AnimatedMain showConnectingMessage={false}>
      <div className="flex justify-center mt-24">
        <img className="w-[123px] h-[123px]" src={ghostIcon} alt="logo" />
      </div>
      <h1 className="text-primarytext text-3xl font-rubik text-center mb-6 mt-14">Enter your password</h1>
      <form className="flex flex-col items-center px-6" onKeyDown={handleKeyDown}>
        <PasswordInput
          placeholder="Password"
          id="password"
          value={password}
          isValid={isValid}
          onChange={(e) => {
            if (error) setError('')
            setPassword(e.target.value)
          }}
        />
        <ErrorMessage message={error} />
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-mutedtext hover:underline font-lato text-lg font-light"
        >
          Forgot Password
        </button>
      </div>

      <div className="fixed bottom-0 left-0 w-full px-6 pb-6">
        <button
          type="button"
          onClick={login}
          className="w-full h-[52px] text-lg font-lato font-semibold rounded-[10px] bg-primary text-secondarytext cursor-pointer hover:bg-hover"
        >
          Login
        </button>
      </div>
    </AnimatedMain>
  )
}
