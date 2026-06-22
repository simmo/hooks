import { describe, expect, test, vi } from 'vitest';
import { renderHookServer } from '../../utils/renderHookServer.js';
import { useRaf } from './index';

describe('useRaf', () => {
  test('does not execute callback when rendered on the server', () => {
    const callback = vi.fn().mockName('mock callback');

    renderHookServer(() => useRaf(callback));

    expect(callback).not.toHaveBeenCalled();
  });
});
