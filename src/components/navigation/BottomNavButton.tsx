import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface BottomNavButtonProps {
  icon: React.ElementType
  path: string | string[]
}

const BottomNavButton: React.FC<BottomNavButtonProps> = ({ icon: Icon, path }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = Array.isArray(path) ? path.includes(location.pathname) : location.pathname === path

  return (
    <button
      onClick={() => navigate(Array.isArray(path) ? path[0] : path)}
      className={`flex flex-col items-center relative pt-2 ${
        isActive ? 'border-t-4 border-primary' : 'border-t-4 border-transparent'
      }`}
    >
      <Icon className={`h-7 w-7 ${isActive ? 'text-primary' : 'text-mutedtext'}`} />
    </button>
  )
}

export default BottomNavButton
