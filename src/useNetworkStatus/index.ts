import { useState, useEffect } from 'react'

interface NetworkStatus {
  online: boolean
}

const isSupported = typeof window !== 'undefined'

export default function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>({
    online: isSupported ? navigator?.onLine : undefined,
  })

  useEffect(() => {
    if (!isSupported) return

    const ONLINE = 'online'
    const OFFLINE = 'offline'
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
