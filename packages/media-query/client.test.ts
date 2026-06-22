import { afterEach, describe, expect, test, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useMediaQuery } from './index';

describe('useMediaQuery', () => {
  const addEventListener = vi.fn();
  const removeEventListener = vi.fn();

  if ('window' in global) {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      addEventListener,
      matches: false,
      media: query,
      onchange: null,
      removeEventListener,
    }));
  }

  afterEach(() => {
    addEventListener.mockClear();
    removeEventListener.mockClear();
  });

  test('returns the current match', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 300px)'));

    expect(result.current).toBe(false);
  });

  test('listens for changes', () => {
    renderHook(() => useMediaQuery('(min-width: 300px)'));

    expect(addEventListener).toHaveBeenCalled();
  });

  test('responds to changes', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 300px)'));

    act(() => {
      addEventListener.mock.calls[0][1]({ matches: true });
    });

    expect(result.current).toBe(true);

    act(() => {
      addEventListener.mock.calls[0][1]({ matches: true });
    });

    expect(result.current).toBe(true);
  });

  test('removes the listener', () => {
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 300px)'));

    unmount();

    expect(removeEventListener).toHaveBeenCalled();
  });
});
