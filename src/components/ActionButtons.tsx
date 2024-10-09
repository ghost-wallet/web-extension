import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

export default function ActionButtons() {
  const navigate = useNavigate()

  return (
    <div className="my-4 flex justify-between gap-8">
      <button
        className="flex flex-col items-center justify-center group"
        onClick={() => navigate('/send')}
      >
        <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full mb-1 transition group-hover:bg-secondary">
          <ArrowUpIcon className="h-6 w-6 text-secondarytext" />
        </div>
        <span className="text-primarytext text-base font-lato transition group-hover:text-mutedtext">
          Send
        </span>
      </button>
      <button
        className="flex flex-col items-center justify-center group"
        onClick={() => navigate('/receive')}
      >
        <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full mb-1 transition group-hover:bg-secondary">
          <ArrowDownIcon className="h-6 w-6 text-secondarytext" />
        </div>
        <span className="text-primarytext text-base font-lato transition group-hover:text-mutedtext">
          Receive
        </span>
      </button>
    </div>
  )
}
