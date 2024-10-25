import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Status } from '@/wallet/kaspa/wallet'
import useSettings from '../hooks/contexts/useSettings'
import useKaspa from '../hooks/contexts/useKaspa'
import usePromise from '../hooks/usePromise'

export default function Landing() {
  const settings = useSettings()
  const { kaspa, load, request } = useKaspa()
  const navigate = useNavigate()

  const [loadedSettings] = usePromise(() => {
    return settings.load()
  }, [])

  const [loadedKaspa] = usePromise(() => {
    return load()
  }, [])

  useEffect(() => {
    const connectNode = async () => {
      if (!kaspa.connected) {
        try {
          await request('node:connect', [settings.settings.nodes[settings.settings.selectedNode].address])
          console.log('Successfully connected to the node.')
        } catch (error) {
          console.error('Error connecting to node:', error)
        }
      }
    }

    if (loadedSettings && loadedKaspa) {
      // Perform node:connect after loading settings and kaspa
      connectNode()

      switch (kaspa.status) {
        case Status.Uninitialized:
          navigate('/create')
          break
        case Status.Locked:
          navigate('/unlock')
          break
        case Status.Unlocked:
          navigate('/wallet')
          break
        default:
      }
    }
  }, [
    loadedSettings,
    loadedKaspa,
    kaspa.connected,
    kaspa.status,
    request,
    settings.settings.nodes,
    settings.settings.selectedNode,
    navigate,
  ])

  return null
}
