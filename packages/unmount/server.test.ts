import { describe, expect, test, vi } from 'vitest';
import { renderHookServer } from '../../utils/renderHookServer.js';
import { useUnmount } from '.';

describe('useUnmount', () => {
  test('callback is not executed', () => {
    const callback = vi.fn();

    renderHookServer(() => {
      useUnmount(callback);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  test('renders without error', () => {
    const callback = vi.fn();

    const render = () =>
      renderHookServer(() => {
        useUnmount(callback);
      });

    expect(render).not.toThrow();
  });
});
