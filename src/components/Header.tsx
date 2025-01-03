import React from 'react'
import BackButton from '@/components/buttons/BackButton'

interface HeaderProps {
  title: string
  showBackButton?: boolean
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  return (
    <div className="relative flex items-center justify-center p-4">
      {showBackButton && (
        <div className="absolute left-0 pl-4">
          <BackButton />
        </div>
      )}
      <h1 className="text-primarytext text-2xl font-rubik text-center">{title}</h1>
    </div>
  )
}

export default Header
