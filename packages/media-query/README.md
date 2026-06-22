# 🎒 @hooks/media-query

React hook to respond to media queries

![NPM version](https://img.shields.io/npm/v/@hooks/media-query?style=flat-square)
![License](https://img.shields.io/npm/l/@hooks/media-query?style=flat-square)

## Install

```bash
npm i @hooks/media-query
```

## Usage

### useMediaQuery

```ts
useMediaQuery(query: string, fallback?: boolean): boolean
```

#### Parameters

##### `query: string`

A string representing the media query to parse.

##### `fallback?: boolean`

The initial match state, defaults to `false`.

#### Return `boolean`

Returns `true` if the document currently matches the media query list, `false` if not.
