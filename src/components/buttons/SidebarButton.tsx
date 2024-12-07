import React from 'react'
import { SidebarOpenIcon } from 'lucide-react'

const SidebarButton: React.FC = () => {
  const handleSidebarOpen = async () => {
  }

  return (
    <button onClick={handleSidebarOpen} className="flex items-center">
      <SidebarOpenIcon className="h-6 w-6 transform transition-transform duration-300 hover:scale-125 text-mutedtext" />
    </button>
  )
}

export default SidebarButton
