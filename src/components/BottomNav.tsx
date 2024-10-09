import { useNavigate, useLocation } from 'react-router-dom'
import {
  Cog6ToothIcon,
  BanknotesIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-bgdark border-t border-muted p-2">
      <div className="flex justify-around text-primarytext">
        <button
          onClick={() => navigate('/wallet')}
          className="flex flex-col items-center"
        >
          <BanknotesIcon
            className={`h-6 w-6 ${
              isActive('/wallet') ? 'text-primary' : 'text-primarytext'
            }`}
          />
          <span
            className={`text-xs ${
              isActive('/wallet') ? 'text-primary' : 'text-primarytext'
            }`}
          >
            Assets
          </span>
        </button>
        <button
          onClick={() => navigate('/transactions')}
          className="flex flex-col items-center"
        >
          <DocumentTextIcon
            className={`h-6 w-6 ${
              isActive('/transactions') ? 'text-primary' : 'text-primarytext'
            }`}
          />
          <span
            className={`text-xs ${
              isActive('/transactions') ? 'text-primary' : 'text-primarytext'
            }`}
          >
            Transactions
          </span>
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="flex flex-col items-center"
        >
          <Cog6ToothIcon
            className={`h-6 w-6 ${
              isActive('/settings') ? 'text-primary' : 'text-primarytext'
            }`}
          />
          <span
            className={`text-xs ${
              isActive('/settings') ? 'text-primary' : 'text-primarytext'
            }`}
          >
            Settings
          </span>
        </button>
      </div>
    </nav>
  )
}
