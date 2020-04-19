#!/usr/bin/env node

const Listr = require('listr')
const prettier = require('prettier')
const { createScript, readDirAsync, writeFileAsync } = require('../../utils')

const script = createScript({
  name: 'Generate project README',
  task: async () => {
    const tasks = new Listr([
      {
        title: 'Generating new content',
        task: async ctx => {
          const packageNames = await readDirAsync('./packages', {
            withFileTypes: true,
          })
          const packages = packageNames
            .filter(item => item.isDirectory())
            .map(({ name: path }) => {
              const {
                name,
                description,
              } = require(`${process.cwd()}/packages/${path}/package.json`)
              const npmBadge = `![npm](https://img.shields.io/npm/v/${name}?style=flat-square)`

              return `| [${name}](packages/${path}) | ${npmBadge} | ${description} |`
            })
            .join('\n')

          ctx.newContent = prettier.format(
            `# 🎒 React Hooks
A modular collection of React hooks.

🦄 TypeScript support • 🐐 Fully tested • 👾 Server rendering compatible

![Travis](https://img.shields.io/travis/com/simmo/hooks?style=flat-square)
![Netlify](https://img.shields.io/netlify/netlify-id?style=flat-square)
![License](https://img.shields.io/github/license/simmo/hooks?style=flat-square)

## Help

Run \`yarn go\`

## Packages

See \`./packages/*\` for individual package installation details.

| Package | Version | Description |
| ------- | ------- | ----------- |
${packages}`,
            { parser: 'markdown' }
          )
        },
      },
      {
        title: 'Save',
        task: async ctx => writeFileAsync('README.md', ctx.newContent),
      },
    ])

    return await tasks.run()
  },
})

require.main === module && script.run()

module.exports = script
