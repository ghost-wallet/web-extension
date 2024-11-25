import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Status } from '@/utils/constants/constants'
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
        } catch (error) {
          console.error('Error connecting to node:', error)
        }
      }
    }

    if (loadedSettings && loadedKaspa) {
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
  }, [loadedKaspa, loadedSettings])

  return null
}
