# @hooks/media-query

React hook to respond to media queries

![npm](https://img.shields.io/npm/v/hooks/media-query?style=flat-square)

## Install

```bash
npm i @hooks/media-query
```

## Usage

### useMediaQuery

```ts
useMediaQuery(query: string, fallback = false): boolean
```

#### Parameters

##### `query: string`

A string representing the media query to parse.

##### `fallback = false`

The initial match state, defaults to `false`.

#### Return

Returns `true` if the document currently matches the media query list, `false` if not.
