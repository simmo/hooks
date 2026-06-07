import { describe, expect, test } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useQueue } from '.';
import { Queue } from './Queue';

describe('useQueue', () => {
  test('initialises with an empty queue', () => {
    const { result } = renderHook(() => useQueue());

    expect(result.current).toBeInstanceOf(Queue);
    expect(result.current.size).toBe(0);
  });

  test('initialises with a populated queue', () => {
    const { result } = renderHook(() => useQueue(['a', 'b', 'c']));

    expect(result.current).toBeInstanceOf(Queue);
    expect(result.current.size).toBe(3);
  });
});
