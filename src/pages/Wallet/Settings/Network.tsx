import React from 'react'
import useSettings from '@/hooks/contexts/useSettings'
import useKaspa from '@/hooks/contexts/useKaspa'
import ConnectingToNetwork from '@/components/ConnectingToNetwork'

const Network: React.FC = () => {
  const { settings, updateSetting } = useSettings()
  const { kaspa, request } = useKaspa()

  const handleNodeChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(event.target.value)
    try {
      updateSetting('selectedNode', id)
      await request('node:connect', [settings.nodes[id].address])
    } catch (error) {
      console.error('Error connecting to node:', error)
    }
  }

  return (
    <>
      <div className="flex items-center justify-center gap-2 mb-2">
        <span
          className={`px-2 py-1 ${kaspa.connected ? 'text-success text-base' : 'text-mutedtext text-base'}`}
        >
          {kaspa.connected ? (
            `Connected to ${settings.nodes[settings.selectedNode].address}`
          ) : (
            <ConnectingToNetwork />
          )}
        </span>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-2">
        <div className="flex gap-1 mx-1">
          <select
            value={settings.selectedNode.toString()}
            onChange={handleNodeChange}
            className="w-full py-2 px-2 border rounded border-muted bg-bgdarker text-base text-primarytext cursor-pointer"
          >
            {settings.nodes.map((node, id) => (
              <option key={id} value={id.toString()}>
                {node.address}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  )
}

export default Network
