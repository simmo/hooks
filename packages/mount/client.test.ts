import { describe, expect, test, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMount } from './index';

describe('useMount', () => {
  test('executes callback on initial render only', () => {
    const callback = vi.fn();

    const { rerender } = renderHook(() => {
      useMount(callback);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    rerender();

    expect(callback).toHaveBeenCalledTimes(1);

    rerender();

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
