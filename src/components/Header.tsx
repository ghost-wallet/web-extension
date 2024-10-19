import React from 'react'
import BackButton from '@/components/buttons/BackButton'

interface HeaderProps {
  title: string
  showBackButton?: boolean
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  return (
    <div className="flex items-center justify-between p-6">
      {showBackButton ? <BackButton /> : <div className="w-6" />}
      <h1 className="text-primarytext text-3xl font-rubik text-center flex-grow">{title}</h1>
      <div className="w-6" />
    </div>
  )
}

export default Header
