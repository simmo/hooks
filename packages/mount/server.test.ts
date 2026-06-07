import { describe, test, expect, vi } from 'vitest';
import { renderHookServer } from '../../utils/renderHookServer.js';
import { useMount } from '.';

describe('useMount', () => {
  test('callback is not executed', () => {
    const callback = vi.fn();

    renderHookServer(() => {
      useMount(callback);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  test('renders without error', () => {
    const callback = vi.fn();

    const render = () =>
      renderHookServer(() => {
        useMount(callback);
      });

    expect(render).not.toThrow();
  });
});
