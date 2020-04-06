#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires, no-undef */

const { readDirAsync, writeFileAsync } = require('./utils')

const cwd = process.cwd()

const template = `# React Hooks
A modular collection of React hooks.

🦄 TypeScript support • 🐐 Fully tested • 👾 Server rendering compatible

![Travis](https://img.shields.io/travis/com/simmo/hooks?style=flat-square)
![License](https://img.shields.io/github/license/simmo/hooks?style=flat-square)

## Packages

See \`./packages/*\` for individual package installation details.

| Package | Version | Description |
| ------- | ------- | ----------- |`

async function run() {
  const packageNames = await readDirAsync('./packages', {
    withFileTypes: true,
  })

  const packages = packageNames
    .filter(item => item.isDirectory())
    .map(item => {
      const pkg = require(`${cwd}/packages/${item.name}/package.json`)
      const npmBadge = `![npm](https://img.shields.io/npm/v/${pkg.name}?style=flat-square)`

      return `| [${pkg.name}](packages/${item.name}) | ${npmBadge} | ${pkg.description} |`
    })
    .join('\n')

  await writeFileAsync('README.md', `${template}\n${packages}\n`)
}

run()
