# @hooks/interval

React hook to wrap setInterval

![npm](https://img.shields.io/npm/v/hooks/interval?style=flat-square)

## Install

```bash
npm i @hooks/interval
```

## Usage

### useInterval

```ts
useInterval(callback: Function, interval?: number | null): void
```

#### Parameters

##### `callback: Function`

Will be executed each time the `interval` elapses.

##### `interval?: number | null`

Length of time in milliseconds before the `callback` is executed. Providing `null` will clear the interval.
