import { useState, useEffect } from 'react'

const ONLINE = 'online'
const OFFLINE = 'offline'

interface NetworkStatus {
  online: boolean
}

export default function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>({
    online: typeof window !== 'undefined' ? navigator?.onLine : undefined,
  })

  useEffect(() => {
    const updateOnlineStatus = () => {
      setStatus(prevStatus => ({
        ...prevStatus,
        online: navigator?.onLine,
      }))
    }

    window.addEventListener(ONLINE, updateOnlineStatus)
    window.addEventListener(OFFLINE, updateOnlineStatus)

    return () => {
      window.removeEventListener(ONLINE, updateOnlineStatus)
      window.removeEventListener(OFFLINE, updateOnlineStatus)
    }
  }, [])

  return status
}
