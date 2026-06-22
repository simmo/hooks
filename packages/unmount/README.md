# 🎒 @hooks/unmount

React hook execute a callback on component unmount

![NPM version](https://img.shields.io/npm/v/@hooks/unmount?style=flat-square)
![License](https://img.shields.io/npm/l/@hooks/unmount?style=flat-square)

## Install

```bash
npm i @hooks/unmount
```

## Usage

### useUnmount

```ts
useUnmount(callback: () => void, hook?: (effect: EffectCallback, deps?: DependencyList) => void): void
```

#### Parameters

##### `callback: () => void`

Function to execute.

##### `hook?: (effect: EffectCallback, deps?: DependencyList) => void`

Hook to use, defaults to useEffect.

#### Return `void`
