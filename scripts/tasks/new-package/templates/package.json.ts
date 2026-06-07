export const template = ({
  packageName,
  keywords,
  description,
}: {
  packageName: string;
  keywords: string[];
  description: string;
}) => `{
  "name": "@hooks/${packageName}",
  "description": "${description}",
  "type": "module",
  "keywords": [
${keywords.map(keyword => `    "${keyword}"`).join(',\n')}
  ],
  "version": "0.0.0",
  "main": "dist/index.cjs",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./package.json": "./package.json"
  },
  "files": [
    "dist"
  ],
  "author": "Mike Simmonds (https://mike.id)",
  "license": "MIT",
  "scripts": {
    "prepublishOnly": "npm run build",
    "build": "tsx ../../scripts/build.ts",
    "typecheck": "tsx ../../scripts/typecheck.ts"
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
}`;
