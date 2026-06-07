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
            `# 🎒 React Hooks
A modular collection of React hooks.

🦄 TypeScript support • 🐐 Fully tested • 👾 Server rendering compatible

![License](https://img.shields.io/github/license/simmo/hooks?style=flat-square)

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
