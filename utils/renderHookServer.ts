import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

export function renderHookServer<F>(hook: () => F): F {
  let result: F | undefined = undefined;

  function Wrapper() {
    result = hook();

    return createElement('div');
  }

  renderToString(createElement(Wrapper));

  return result!;
}
