import { describe, test, expect } from 'vitest';

import { renderHookServer } from '../../utils/renderHookServer.js';
import { useRenderCount } from './index';

describe('useRenderCount', () => {
  test('returns initial value', () => {
    const result = renderHookServer(() => useRenderCount());

    expect(result).toBe(1);
  });
});
