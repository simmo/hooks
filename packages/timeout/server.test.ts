import { describe, expect, test, vi } from 'vitest';
import { renderHookServer } from '../../utils/renderHookServer.js';
import { useTimeout } from './index';

describe('useTimeout', () => {
  test('should render', () => {
    const callback = vi.fn().mockName('mock callback');

    renderHookServer(() => useTimeout(callback, 1000));

    expect(callback).not.toHaveBeenCalled();
  });
});
