import React from 'react'
import Spinner from '@/components/loaders/Spinner'
import useSettings from '@/hooks/contexts/useSettings'

const ConnectingToNetwork: React.FC = () => {
  const { settings } = useSettings()

  return (
    <div className="flex items-center bg-darkmuted text-primarytext text-sm p-1 rounded">
      <p className="px-2">{`Connecting to ${settings.nodes[settings.selectedNode].address}...`}</p>
      <div className="p-1">
        <Spinner size="small" />
      </div>
    </div>
  )
}

export default ConnectingToNetwork
