import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useInterval } from '.';

describe('useInterval', () => {
  const callback = vi.fn().mockName('mock callback');

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    callback.mockClear();
  });

  test('executes callback after delay', () => {
    renderHook<void, { interval?: number | null }>(
      ({ interval }) => useInterval(callback, interval),
      {
        initialProps: { interval: 500 },
      },
    );

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test('pauses interval if no delay', () => {
    const { rerender } = renderHook<void, { interval?: number | null }>(
      ({ interval }) => useInterval(callback, interval),
      {
        initialProps: { interval: 500 },
      },
    );

    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);

    rerender({ interval: null });

    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);

    rerender({ interval: 500 });

    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
