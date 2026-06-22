import Listr from 'listr';
import prettier from 'prettier';
import { readdir, writeFile } from 'fs/promises';

import { createScript } from '../../utils/index.js';
import { fileURLToPath } from 'url';

export const script = createScript({
  name: 'Generate project README',
  task: async () => {
    const tasks = new Listr([
      {
        title: 'Generating new content',
        task: async ctx => {
          const packageNames = await readdir('./packages', {
            withFileTypes: true,
          });
          const packages = await Promise.all(
            packageNames
              .filter(item => item.isDirectory())
              .map(async ({ name: path }) => {
                const { name, description } = await import(
                  `${process.cwd()}/packages/${path}/package.json`
                );
                const npmBadge = `![npm](https://img.shields.io/npm/v/${name}?style=flat-square)`;

                return `| [${name}](packages/${path}) | ${npmBadge} | ${description} |`;
              }),
          );

          ctx.newContent = await prettier.format(
            `<br/>

<picture>
	<source media="(prefers-color-scheme: dark)" srcset="./.github/assets/logo-dark.svg">
	<img alt="Hooks logo" src="./.github/assets/logo-light.svg" width="150">
</picture>

<p><small>A modular collection of React hooks.</small></p>

<p>🦄 TypeScript support • 🐐 Fully tested • 👾 Server rendering compatible</p>

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/simmo/hooks/ci.yml?style=flat)](https://github.com/simmo/hooks/actions/workflows/ci.yml) ![License](https://img.shields.io/github/license/simmo/hooks?style=flat)

---

## Help

Run \`npm start\`

## Packages

See \`./packages/*\` for individual package installation details.

| Package | Version | Description |
| ------- | ------- | ----------- |
${packages.join('\n')}`,
            { parser: 'markdown' },
          );
        },
      },
      {
        title: 'Save',
        task: async ctx => writeFile('README.md', ctx.newContent),
      },
    ]);

    return await tasks.run();
  },
});

if (process.argv[1] === fileURLToPath(import.meta.url)) script.run();
