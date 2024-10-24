import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Status } from '@/wallet/kaspa/wallet'
import useSettings from '../hooks/contexts/useSettings'
import useKaspa from '../hooks/contexts/useKaspa'
import usePromise from '../hooks/usePromise'

export default function Landing() {
  const settings = useSettings()
  const { kaspa, load } = useKaspa()
  const navigate = useNavigate()

  const [loadedSettings] = usePromise(() => {
    return settings.load()
  }, [])

  const [loadedKaspa] = usePromise(() => {
    return load()
  }, [])

  useEffect(() => {
    if (loadedSettings && loadedKaspa) {
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
  }, [loadedSettings, loadedKaspa])

  return null
}
