# @hooks/mount

React hook to execute callback on component mount

![NPM version](https://img.shields.io/npm/v/@hooks/mount?style=flat-square)
![Travis](https://img.shields.io/travis/com/simmo/hooks?style=flat-square)
![License](https://img.shields.io/npm/l/@hooks/mount?style=flat-square)

## Install

```bash
npm i @hooks/mount
```

## Usage

### useMount

```ts
useMount(callback: () => void, hook: (effect: EffectCallback, deps?: DependencyList) => void = useEffect)
```

#### Parameters

##### `callback: () => void`

Function to execute.

##### `hook: (effect: EffectCallback, deps?: DependencyList) => void = useEffect`

Hook to use, defaults to useEffect.
