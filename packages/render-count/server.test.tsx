import { describe, test, expect } from 'vitest';

import { renderHookServer } from '../../utils/renderHookServer.js';
import { useRenderCount } from '.';

describe('useRenderCount', () => {
  test('returns initial value', () => {
    const result = renderHookServer(() => useRenderCount());

    expect(result).toBe(1);
  });
});
