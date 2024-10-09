import { useNavigate } from 'react-router-dom';
import { Cog6ToothIcon, BanknotesIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-bg-dark border-t border-muted p-2">
      <div className="flex justify-around text-primarytext">
        <button onClick={() => navigate('/wallet')} className="flex flex-col items-center">
          <BanknotesIcon className="h-6 w-6" />
          <span className="text-xs">Assets</span>
        </button>
        <button onClick={() => navigate('/transactions')} className="flex flex-col items-center">
          <DocumentTextIcon className="h-6 w-6" />
          <span className="text-xs">Transactions</span>
        </button>
        <button onClick={() => navigate('/settings')} className="flex flex-col items-center">
          <Cog6ToothIcon className="h-6 w-6" />
          <span className="text-xs">Settings</span>
        </button>
      </div>
    </nav>
  );
}
