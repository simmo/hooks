import { glob, readdir } from 'fs/promises';
import inquirer from 'inquirer';
import { header, isValidScriptExport } from './utils/index.js';
import { resolve } from 'path';

header();

const choices = await (async () => {
  const scripts: Promise<{ name: string; value: () => Promise<void> }>[] = [];

  for await (const script of glob('./scripts/tasks/*/index.ts')) {
    scripts.push(
      import(resolve(script)).then(({ script }) => {
        if (!isValidScriptExport(script)) {
          throw new Error(
            `Script "${script}" does not have a valid \`script\` export`,
          );
        }

        return { name: script.name, value: script.run };
      }),
    );
  }

  return Promise.all(scripts);
})();

const { script } = await inquirer.prompt<{
  script: () => Promise<void>;
}>([
  {
    name: 'script',
    message: 'What would you like to do?',
    type: 'select',
    choices,
  },
]);

await script();
