# @hooks/raf

React hook to wrap requestAnimationFrame

![NPM version](https://img.shields.io/npm/v/@hooks/raf?style=flat-square)
![Travis](https://img.shields.io/travis/com/simmo/hooks?style=flat-square)
![License](https://img.shields.io/npm/l/@hooks/raf?style=flat-square)

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
