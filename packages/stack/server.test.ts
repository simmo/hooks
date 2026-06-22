import { describe, expect, test } from 'vitest';
import { renderHookServer } from '../../utils/renderHookServer.js';
import { useStack } from './index';
import { Stack } from './Stack';

describe('useStack', () => {
  test('initialises with an empty stack', () => {
    const result = renderHookServer(() => useStack());

    expect(result).toBeInstanceOf(Stack);
    expect(result.size).toBe(0);
  });

  test('initialises with a populated stack', () => {
    const result = renderHookServer(() => useStack(['a', 'b', 'c']));

    expect(result).toBeInstanceOf(Stack);
    expect(result.size).toBe(3);
  });
});
