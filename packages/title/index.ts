import { useEffect } from 'react';

/**
 * @param title Will be used to set the document title.
 */
export function useTitle(title: string): void {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
