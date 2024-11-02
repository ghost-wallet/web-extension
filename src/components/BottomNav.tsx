import { useNavigate, useLocation } from 'react-router-dom'
import { Cog6ToothIcon, HomeIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav
      className="fixed bottom-0 left-0 w-full bg-bgdark border-t border-darkmuted p-4"
      style={{ boxShadow: '0 -10px 15px rgba(0, 0, 0, 0.3)' }} // Taller shadow above the nav
    >
      <div className="relative flex justify-around">
        <button onClick={() => navigate('/wallet')} className="flex flex-col items-center relative">
          <HomeIcon
            className={`h-7 w-7 transform transition-transform duration-300 hover:scale-125 ${
              isActive('/wallet') ? 'text-primary' : 'text-mutedtext'
            }`}
          />
        </button>
        <button
          onClick={() => navigate('/transactions/kaspa')}
          className="flex flex-col items-center relative"
        >
          <DocumentTextIcon
            className={`h-7 w-7 transform transition-transform duration-300 hover:scale-125 ${
              isActive('/transactions') ? 'text-primary' : 'text-mutedtext'
            }`}
          />
        </button>
        <button onClick={() => navigate('/settings')} className="flex flex-col items-center relative">
          <Cog6ToothIcon
            className={`h-7 w-7 transform transition-transform duration-300 hover:scale-125 ${
              isActive('/settings') ? 'text-primary' : 'text-mutedtext'
            }`}
          />
        </button>
      </div>
    </nav>
  )
}
