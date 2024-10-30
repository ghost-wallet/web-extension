import React from 'react'
import Spinner from '@/components/Spinner'

interface SpinnerPageProps {
  displayText?: string
}

const SpinnerPage: React.FC<SpinnerPageProps> = ({ displayText }) => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <p className="text-base text-mutedtext text-center p-6">{displayText}</p>
      <Spinner />
    </div>
  )
}

export default SpinnerPage
