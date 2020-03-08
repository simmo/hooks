import { useState, useEffect } from 'react'

const ONLINE = 'online'
const OFFLINE = 'offline'

interface NetworkStatus {
  online: boolean
}

/**
 * @returns Returns an object containing details about the network status.
 */
export default function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    online:
      typeof window !== 'undefined' ? window?.navigator?.onLine : undefined,
  })

  useEffect(() => {
    const updateOnlineStatus = () => {
      setStatus(prevStatus => ({
        ...prevStatus,
        online:
          typeof window !== 'undefined' ? window?.navigator?.onLine : undefined,
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
