import { describe, expect, test } from 'vitest';
import { renderHookServer } from '../../utils/renderHookServer.js';
import { useNetworkStatus } from './index';

describe('useNetworkStatus', () => {
  test('returns undefined', () => {
    const result = renderHookServer(() => useNetworkStatus());

    expect(result).toEqual({ online: undefined });
  });
});
