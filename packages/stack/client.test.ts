import { describe, expect, test } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useStack } from '.';
import { Stack } from './Stack';

describe('useStack', () => {
  test('initialises with an empty stack', () => {
    const { result } = renderHook(() => useStack());

    expect(result.current).toBeInstanceOf(Stack);
    expect(result.current.size).toBe(0);
  });

  test('initialises with a populated stack', () => {
    const { result } = renderHook(() => useStack(['a', 'b', 'c']));

    expect(result.current).toBeInstanceOf(Stack);
    expect(result.current.size).toBe(3);
  });
});
