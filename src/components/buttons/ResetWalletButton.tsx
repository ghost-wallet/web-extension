import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useKaspa from '@/hooks/contexts/useKaspa'
import ErrorMessage from '@/components/messages/ErrorMessage'
import ErrorMessages from '@/utils/constants/errorMessages'
import Checkbox from '@/components/Checkbox'

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
      console.error(`${ErrorMessages.RESET.FAILED}:`, err)
      setError(ErrorMessages.RESET.FAILED)
      setIsChecked(false)
    }
  }

  return (
    <div>
      <div className="flex gap-3 justify-start items-center mt-16 mb-8">
        <Checkbox checked={isChecked} onChange={setIsChecked} />
        <label htmlFor="reset-confirmation" className="text-mutedtext text-base">
          I have direct access to my 12-word secret recovery phrase.
        </label>
      </div>

      {error && <ErrorMessage message={error} className="h-6 mb-4 mt-2 flex justify-center items-center" />}

      <div className="w-full pb-20">
        <button
          type="button"
          disabled={!isChecked}
          onClick={handleConfirm}
          className={`w-full h-[52px] text-base font-semibold rounded-[25px] ${
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
