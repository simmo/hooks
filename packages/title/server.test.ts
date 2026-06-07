import { describe, expect, test } from 'vitest';
import { renderHookServer } from '../../utils/renderHookServer.js';
import { useTitle } from '.';

describe('useTitle', () => {
  test('renders', () => {
    const render = () => renderHookServer(() => useTitle('Test'));

    expect(render).not.toThrow();
  });
});
