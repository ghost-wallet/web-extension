import React from 'react'
import { useNavigate } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function Swap() {
  const navigate = useNavigate()

  return (
    <>
      <AnimatedMain>
        <div className="flex items-center justify-between mb-4 p-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-primarytext hover:text-mutedtext transition"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-primarytext text-3xl font-rubik text-center flex-grow">
            Swap
          </h1>
          <div className="w-6" />
        </div>
        <p className="text-primarytext text-base p-6">Coming soon...</p>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
