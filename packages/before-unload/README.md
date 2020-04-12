# @hooks/before-unload

React hook to provide a message prompt before the page is unloaded

![NPM version](https://img.shields.io/npm/v/@hooks/before-unload?style=flat-square)
![Travis](https://img.shields.io/travis/com/simmo/hooks?style=flat-square)
![License](https://img.shields.io/npm/l/@hooks/before-unload?style=flat-square)

## Install

```bash
npm i @hooks/before-unload
```

## Usage

### useBeforeUnload

```ts
useBeforeUnload(message?: string)
```

#### Parameters

##### `message?: string`

If provided, will cause the message to be shown before the page is unloaded.
