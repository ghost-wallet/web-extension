import { useNavigate, useLocation } from 'react-router-dom'
import { HomeIcon, ArrowsRightLeftIcon, BoltIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav
      className="fixed bottom-0 left-0 w-full bg-bgdark border-t border-darkmuted p-4"
      style={{ boxShadow: '0 -10px 15px rgba(0, 0, 0, 0.3)' }}
    >
      <div className="relative flex justify-around">
        <button onClick={() => navigate('/wallet')} className="flex flex-col items-center relative">
          <HomeIcon
            className={`h-7 w-7 transform transition-transform duration-300 hover:scale-125 ${
              isActive('/wallet') ? 'text-primary' : 'text-mutedtext'
            }`}
          />
        </button>
        <button onClick={() => navigate('/swap')} className="flex flex-col items-center relative">
          <ArrowsRightLeftIcon
            className={`h-7 w-7 transform transition-transform duration-300 hover:scale-125 ${
              isActive('/swap') ? 'text-primary' : 'text-mutedtext'
            }`}
          />
        </button>
        <button onClick={() => navigate('/mint')} className="flex flex-col items-center relative">
          <BoltIcon
            className={`h-7 w-7 transform transition-transform duration-300 hover:scale-125 ${
              isActive('/mint') ? 'text-primary' : 'text-mutedtext'
            }`}
          />
        </button>
        <button
          onClick={() => navigate('/transactions/kaspa')}
          className="flex flex-col items-center relative"
        >
          <DocumentTextIcon
            className={`h-7 w-7 transform transition-transform duration-300 hover:scale-125 ${
              isActive('/transactions/kaspa') || isActive('/transactions/krc20')
                ? 'text-primary'
                : 'text-mutedtext'
            }`}
          />
        </button>
      </div>
    </nav>
  )
}
