module.exports = ({ package, keywords, description }) => `{
  "name": "@hooks/${package}",
  "description": "${description}",
  "keywords": [
${keywords.map(keyword => `    "${keyword}"`).join(',\n')}
  ],
  "version": "0.0.0",
  "main": "cjs/index.js",
  "module": "esm/index.js",
  "types": "typings/index.d.ts",
  "typings": "typings/index.d.ts",
  "files": [
    "cjs",
    "esm",
    "typings"
  ],
  "author": "Mike Simmonds (https://mike.id)",
  "license": "MIT",
  "scripts": {
    "prepublishOnly": "yarn build",
    "build": "node ../../scripts/build",
  },
  "publishConfig": {
    "access": "public"
  },
  "peerDependencies": {
    "react": ">=16.8"
  },
  "dependencies": {},
  "devDependencies": {
    "react": "^16.12.0"
  }
}`
