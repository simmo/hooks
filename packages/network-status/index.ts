import { useState, useEffect } from 'react';

const ONLINE = 'online';
const OFFLINE = 'offline';

interface NetworkStatus {
  online?: boolean;
}

const getOnlineStatus = (): boolean | undefined =>
  typeof window !== 'undefined' ? window?.navigator?.onLine : undefined;

/**
 * @returns Returns an object containing details about the network status.
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    online: getOnlineStatus(),
  });

  useEffect(() => {
    const updateOnlineStatus = () => {
      setStatus(prevStatus => ({ ...prevStatus, online: getOnlineStatus() }));
    };

    window.addEventListener(ONLINE, updateOnlineStatus);
    window.addEventListener(OFFLINE, updateOnlineStatus);

    return () => {
      window.removeEventListener(ONLINE, updateOnlineStatus);
      window.removeEventListener(OFFLINE, updateOnlineStatus);
    };
  }, []);

  return status;
}
