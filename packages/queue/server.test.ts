import { describe, expect, test } from 'vitest';
import { renderHookServer } from '../../utils/renderHookServer.js';
import { useQueue } from '.';
import { Queue } from './Queue';

describe('useQueue', () => {
  test('initialises with an empty queue', () => {
    const result = renderHookServer(() => useQueue());

    expect(result).toBeInstanceOf(Queue);
    expect(result.size).toBe(0);
  });

  test('initialises with a populated queue', () => {
    const result = renderHookServer(() => useQueue(['a', 'b', 'c']));

    expect(result).toBeInstanceOf(Queue);
    expect(result.size).toBe(3);
  });
});
