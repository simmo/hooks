# 🎒 @hooks/previous

React hook to remember a value between renders

![NPM version](https://img.shields.io/npm/v/@hooks/previous?style=flat-square)
![License](https://img.shields.io/npm/l/@hooks/previous?style=flat-square)

## Install

```bash
npm i @hooks/previous
```

## Usage

### usePrevious

```ts
usePrevious<T>(value: T): T | undefined
```

#### Parameters

##### `value: T`

The value to be returned on the next render.

#### Return `T | undefined`

Returns the last value, undefined for initial render.
