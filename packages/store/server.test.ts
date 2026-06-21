import { describe, expect, test } from 'vitest';
import { renderHookServer } from '../../utils/renderHookServer.js';
import { createStore } from './index';

describe('createStore', () => {
  describe('initial state', () => {
    test('returns default state', () => {
      const useExampleStore = createStore();
      const result = renderHookServer(() => useExampleStore());

      expect(result[0]).toBe(undefined);
    });

    test('returns provided state', () => {
      const initialState = ['a', 'b', 'c'];
      const useExampleStore = createStore({ initialState });
      const result = renderHookServer(() => useExampleStore());

      expect(result[0]).toBe(initialState);
    });
  });
});
