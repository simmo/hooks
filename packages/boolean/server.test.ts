import { describe, expect, test } from 'vitest';
import { renderHookServer } from '../../utils/renderHookServer';
import { useBoolean } from './index';

describe('useBoolean', () => {
  test('returns initial value', () => {
    const initialValue = true;
    const [result] = renderHookServer(() => useBoolean(initialValue));

    expect(result).toBe(initialValue);
  });
});
