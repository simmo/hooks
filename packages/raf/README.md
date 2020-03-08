# @hooks/raf

React hook to wrap requestAnimationFrame

![npm](https://img.shields.io/npm/v/hooks/raf?style=flat-square)

## Install

```bash
npm i @hooks/raf
```

## Usage

### useRaf

```ts
useRaf(callback: C, deps?: readonly D[]): void
```

#### Parameters

##### `callback: C`

Will be executed before the each repaint.

##### `deps?: readonly D[]`

An array of values that, when modified, will clear and reset the callback effect. See https://reactjs.org/docs/hooks-reference.html#uselayouteffect.
