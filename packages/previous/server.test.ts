import { describe, expect, test } from 'vitest';
import { renderHookServer } from '../../utils/renderHookServer.js';
import { usePrevious } from './index';

describe('usePrevious', () => {
  test('returns undefined', () => {
    const result = renderHookServer(() => usePrevious('test'));

    expect(result).toBeUndefined();
  });
});
