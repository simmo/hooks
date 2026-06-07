import { describe, expect, test, vi } from 'vitest';
import { renderHookServer } from '../../utils/renderHookServer';
import { useInterval } from '.';

describe('useInterval', () => {
  test('should render', () => {
    const callback = vi.fn().mockName('mock callback');

    renderHookServer(() => useInterval(callback, 1000));

    expect(callback).not.toHaveBeenCalled();
  });
});
