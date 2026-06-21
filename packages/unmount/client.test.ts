import { describe, expect, test, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useUnmount } from './index';

describe('useUnmount', () => {
  test('executes callback on unmount', () => {
    const callback = vi.fn();

    const { unmount } = renderHook(() => {
      useUnmount(callback);
    });

    expect(callback).not.toHaveBeenCalled();

    unmount();

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
