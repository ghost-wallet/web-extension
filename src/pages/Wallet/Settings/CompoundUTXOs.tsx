import React, { useState } from 'react'
import { CheckIcon } from '@heroicons/react/24/solid' // Importing the checkmark icon from HeroIcons
import useKaspa from '@/hooks/useKaspa'

const CompoundUTXOs: React.FC = () => {
  const { request } = useKaspa()
  const [isLoading, setIsLoading] = useState(false)
  const [isCompounded, setIsCompounded] = useState(false)

  const handleScan = async () => {
    setIsLoading(true)
    try {
      await request('account:compoundUtxos', [])
      setIsCompounded(true)
      setTimeout(() => {
        setIsCompounded(false)
      }, 3000) // Show Compounded state for 3 seconds
    } catch (error) {
      console.error('[Scan] Error compounding UTXOs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 mb-2">
      <button
        onClick={handleScan}
        className={`${
          isCompounded
            ? 'bg-secondary text-secondarytext cursor-not-allowed'
            : 'bg-primary hover:bg-secondary text-secondarytext'
        } text-base font-semibold font-lato w-[240px] px-8 py-3 rounded-[25px]`}
        disabled={isLoading || isCompounded}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Compounding...
          </span>
        ) : isCompounded ? (
          <span className="flex items-center">
            <CheckIcon className="h-5 w-5 mr-2 text-white" /> Compounded
          </span>
        ) : (
          'Compound UTXOs'
        )}
      </button>
    </div>
  )
}

export default CompoundUTXOs
