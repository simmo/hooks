import { describe, expect, test } from 'vitest';
import { renderHookServer } from '../../utils/renderHookServer';
import { useGeoLocation } from './index';

describe('useGeoLocation', () => {
  test('should render', () => {
    const result = renderHookServer(() => useGeoLocation());

    expect(result[0]).toBeNull();
    expect(result[1]).toBeNull();
  });
});
