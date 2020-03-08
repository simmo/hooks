# @hooks/timeout

React hook to delay function execution

![npm](https://img.shields.io/npm/v/hooks/timeout?style=flat-square)

## Install

```bash
npm i @hooks/timeout
```

## Usage

### useTimeout

```ts
useTimeout(callback: Function, delay?: number): void
```

#### Parameters

##### `callback: Function`

Will be executed when the `delay` elapses.

##### `delay?: number`

Length of time in milliseconds before the `callback` is executed. Providing `null` will clear the timeout.
