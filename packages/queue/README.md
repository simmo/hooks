# 🎒 @hooks/queue

React hook to manage a queue

![NPM version](https://img.shields.io/npm/v/@hooks/queue?style=flat-square)
![License](https://img.shields.io/npm/l/@hooks/queue?style=flat-square)

## Install

```bash
npm i @hooks/queue
```

## Usage

### useQueue

```ts
useQueue<Item>(initialState?: Item[]): Queue<Item>
```

#### Parameters

##### `initialState?: Item[]`

Populate the queue with an array of initial values.

#### Return `Queue<Item>`
