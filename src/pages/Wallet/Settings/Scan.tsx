import React from 'react'
import useKaspa from '@/hooks/useKaspa'

const LogOut: React.FC = () => {
  const { request } = useKaspa()

  const handleScan = () => {
    request('account:scan', []).catch((error) => console.error('Error locking wallet:', error))
  }

  return (
    <div className="flex flex-col items-center gap-2 mb-2">
      <button
        onClick={handleScan}
        className="bg-primary hover:bg-secondary text-secondarytext text-lg font-bold font-lato w-[170px] px-8 py-3 rounded-[25px]"
      >
        Scan
      </button>
    </div>
  )
}

export default LogOut
