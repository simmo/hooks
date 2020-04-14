# 🎒 @hooks/boolean

React hook to store a boolean

![NPM version](https://img.shields.io/npm/v/@hooks/boolean?style=flat-square)
![Travis](https://img.shields.io/travis/com/simmo/hooks?style=flat-square)
![License](https://img.shields.io/npm/l/@hooks/boolean?style=flat-square)

## Install

```bash
npm i @hooks/boolean
```

## Usage

### useBoolean

```ts
useBoolean(initialValue: boolean): [boolean, (nextValue?: boolean) => void]
```

#### Parameters

##### `initialValue: boolean`

The initial state for the value.

#### Return

Returns an array containing the value and a function to update it.
