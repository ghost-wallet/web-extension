import React from 'react'
import { SidebarCloseIcon, SidebarOpenIcon } from 'lucide-react'

const SidebarButton: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleSidebarOpen = async () => {
    // open side panel here
    console.log('Sidebar button open')
  }

  return (
    <button onClick={handleSidebarOpen} className="flex items-center">
      {isOpen ? (
        <SidebarCloseIcon className="h-6 w-6 transform transition-transform duration-300 hover:scale-125 text-mutedtext" />
      ) : (
        <SidebarOpenIcon className="h-6 w-6 transform transition-transform duration-300 hover:scale-125 text-mutedtext" />
      )}
    </button>
  )
}

export default SidebarButton
