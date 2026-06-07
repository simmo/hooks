import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTimeout } from '.';

describe('useTimeout', () => {
  const callback = vi.fn().mockName('mock callback');

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    callback.mockClear();
  });

  test('executes callback after delay', () => {
    renderHook(delay => useTimeout(callback, delay), {
      initialProps: 500,
    });

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('cancels timeout if no delay', () => {
    const { rerender } = renderHook(delay => useTimeout(callback, delay), {
      initialProps: 500,
    });

    expect(callback).not.toHaveBeenCalled();

    rerender();
    vi.advanceTimersByTime(500);

    expect(callback).not.toHaveBeenCalled();

    rerender(500);
    vi.advanceTimersByTime(500);

    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
