# @hooks/geo-location

React hook to return geo location details

![NPM version](https://img.shields.io/npm/v/@hooks/geo-location?style=flat-square)
![Travis](https://img.shields.io/travis/com/simmo/hooks?style=flat-square)
![License](https://img.shields.io/npm/l/@hooks/geo-location?style=flat-square)

## Install

```bash
npm i @hooks/geo-location
```

## Usage

### useGeoLocation

```ts
useGeoLocation(options?: PositionOptions): [Position, PositionError]
```

#### Parameters

##### `options?: PositionOptions`

Passes PositionOptions through to the geolocation API - https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions

#### Return

Returns an array containing the position and any position error.
