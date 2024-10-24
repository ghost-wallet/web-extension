import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useKaspa from '@/hooks/contexts/useKaspa'
import ErrorMessage from '@/components/ErrorMessage'

const ResetWalletButton: React.FC = () => {
  const { request } = useKaspa()
  const navigate = useNavigate()

  const [isChecked, setIsChecked] = useState(false)
  const [error, setError] = useState<string>('')

  const handleConfirm = async () => {
    try {
      await request('wallet:reset', [])
      navigate('/')
    } catch (err: any) {
      setError(`Error resetting wallet: ${err}`)
      setIsChecked(false)
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked)
    setError('')
  }

  return (
    <div>
      <div className="flex gap-3 justify-start items-center mt-16 mb-8">
        <input
          type="checkbox"
          id="reset-confirmation"
          className="cursor-pointer transform scale-150"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="reset-confirmation" className="text-mutedtext text-base font-lato">
          I have direct access to my 12-word or 24-word secret recovery phrase.
        </label>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="w-full pb-10">
        <button
          type="button"
          disabled={!isChecked}
          onClick={handleConfirm}
          className={`w-full h-[52px] text-base font-lato font-semibold rounded-[25px] ${
            isChecked
              ? 'bg-error text-secondarytext cursor-pointer hover:bg-hover'
              : 'bg-slightmuted text-secondarytext cursor-default'
          }`}
        >
          Reset wallet and delete all my data
        </button>
      </div>
    </div>
  )
}

export default ResetWalletButton
