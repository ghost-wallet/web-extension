import React, { useEffect } from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import { currencies } from '@/contexts/Settings'
import useSettings from '@/hooks/useSettings'
import useKaspa from '@/hooks/useKaspa'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Settings() {
  const { settings, updateSetting } = useSettings()
  const { kaspa, request } = useKaspa()

  const handleCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    updateSetting('currency', event.target.value as never)
  }

  // const handleNodeChange = async (
  //   event: React.ChangeEvent<HTMLSelectElement>,
  // ) => {
  //   const id = parseInt(event.target.value)
  //
  //   try {
  //     // Disconnect before trying to connect again to avoid multiple open connections
  //     await request('node:disconnect', [])
  //     await updateSetting('selectedNode', id)
  //     await request('node:connect', [settings.nodes[id].address])
  //   } catch (error) {
  //     console.error('Error connecting to node:', error)
  //   }
  // }

  // Ensure that the WebSocket connection is established before making any requests
  useEffect(() => {
    if (!kaspa.connected) {
      request('node:connect', [
        settings.nodes[settings.selectedNode].address,
      ]).catch((error) => console.error('WebSocket connection error:', error))
    }
  }, [kaspa.connected, request, settings.nodes, settings.selectedNode])

  return (
    <>
      <AnimatedMain>
        <div className="flex flex-col">
          <h1 className="text-primarytext text-3xl font-rubik text-center mb-4">
            Settings
          </h1>

          <div className={'flex flex-col gap-2'}>
            <div className={'px-3'}>
              <h3 className={'flex gap-2 font-bold'}>
                node
                <Badge
                  variant={'outline'}
                  className={
                    kaspa.connected ? 'text-green-500' : 'text-red-500'
                  }
                >
                  {kaspa.connected ? 'connected' : 'disconnected'}
                </Badge>
              </h3>
              <h4>node description</h4>
            </div>
            <div className={'flex gap-1 mx-1'}>
              <Select
                defaultValue={settings.selectedNode.toString()}
                onValueChange={async (id) => {
                  await updateSetting('selectedNode', parseInt(id))
                  await request('node:connect', [
                    settings.nodes[parseInt(id)].address,
                  ])
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="h-64">
                  {settings.nodes.map((node, id) => {
                    return (
                      <SelectItem key={id} value={id.toString()}>
                        {node.name}
                        <p className={'text-xs'}>{node.address}</p>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/*<div className="flex items-center gap-2 mb-2">*/}
          {/*  <h2 className="text-primarytext text-base font-lato">Network</h2>*/}
          {/*  <span*/}
          {/*    className={`px-2 py-1 ${*/}
          {/*      kaspa.connected*/}
          {/*        ? 'text-success text-base font-lato'*/}
          {/*        : 'text-mutedtext text-base font-lato'*/}
          {/*    }`}*/}
          {/*  >*/}
          {/*    {kaspa.connected ? 'Connected' : 'Connecting...'}*/}
          {/*  </span>*/}
          {/*</div>*/}

          {/*<div className="flex flex-col gap-2">*/}
          {/*  <div className="flex gap-1 mx-1">*/}
          {/*    <select*/}
          {/*      value={settings.selectedNode.toString()}*/}
          {/*      onChange={handleNodeChange}*/}
          {/*      className="w-full p-2 border rounded border-muted bg-bgdarker text-primarytext"*/}
          {/*    >*/}
          {/*      {settings.nodes.map((node, id) => (*/}
          {/*        <option key={id} value={id.toString()}>*/}
          {/*          {node.address}*/}
          {/*        </option>*/}
          {/*      ))}*/}
          {/*    </select>*/}
          {/*  </div>*/}
          {/*</div>*/}

          <h2 className="text-primarytext text-base font-lato mb-2 mt-6">
            Currency
          </h2>
          <div className="flex gap-1 mx-1 mb-4">
            <select
              value={settings.currency}
              onChange={handleCurrencyChange}
              className="w-full p-2 border rounded border-muted bg-bgdarker text-primarytext"
            >
              {Object.keys(currencies).map((currency) => (
                <option key={currency} value={currency}>
                  {currency} ({currencies[currency as never]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
