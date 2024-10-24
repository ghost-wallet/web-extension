import React, { useState } from 'react'
import useKaspa from '@/hooks/contexts/useKaspa'

const Scan: React.FC = () => {
  const { request } = useKaspa()
  const [isLoading, setIsLoading] = useState(false)

  const handleScan = async () => {
    setIsLoading(true)
    try {
      await request('account:scan', [])
    } catch (error) {
      console.error('[Scan] Error doing account scan:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 mb-2">
      <button
        onClick={handleScan}
        className={`${
          isLoading
            ? 'bg-secondary text-secondarytext cursor-not-allowed'
            : 'bg-primary hover:bg-secondary text-secondarytext'
        } text-base font-semibold font-lato w-[240px] px-8 py-3 rounded-[25px]`}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex justify-center items-center w-full">
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Scanning...
          </span>
        ) : (
          'Scan'
        )}
      </button>
    </div>
  )
}

export default Scan
