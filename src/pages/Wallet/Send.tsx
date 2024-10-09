import React from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'

export default function Send() {
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
            Send
          </h1>
          <div className="w-6" />
          {/* This div is for spacing to balance the button */}
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
