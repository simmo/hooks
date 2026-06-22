# 🎒 @hooks/store

React hook to provide an observable global store

![NPM version](https://img.shields.io/npm/v/@hooks/store?style=flat-square)
![License](https://img.shields.io/npm/l/@hooks/store?style=flat-square)

## Install

```bash
npm i @hooks/store
```

## Usage

### createStore

```ts
createStore<State>(options?: Options<State>): <SelectedState extends State>(selector?: (state?: SelectedState) => any) => any[]
```

#### Parameters

##### `options?: Options<State>`

- `options.actions`: An object of state update functions.
- `options.initialState`: The initial state of the store.

#### Return `<SelectedState extends State>(selector?: (state?: SelectedState) => any) => any[]`
