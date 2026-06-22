import inquirer from 'inquirer';
import { mkdir, readdir, writeFile } from 'fs/promises';
import Listr from 'listr';
import { createScript } from '../../utils/index.js';
import { fileURLToPath } from 'url';

export const script = createScript({
  name: 'Create new package',
  task: async () => {
    const packagesDir = './packages';
    const validatePackageName = /^[a-z-?]+$/g;
    const existingPackages = await readdir(packagesDir, {
      withFileTypes: true,
    });
    const existingPackageNames = existingPackages
      .filter(item => item.isDirectory())
      .map(({ name }) => name);

    const { packageName, description, keywords } = await inquirer.prompt<{
      packageName: string;
      description: string;
      keywords: string[];
    }>([
      {
        name: 'packageName',
        message: 'What should the package be called?',
        type: 'input',
        validate: value => {
          if (existingPackageNames.includes(value)) {
            return `Package '${value}' already exists, try another name.`;
          }

          if (!validatePackageName.test(value)) {
            return 'Should not contain spaces or special characters';
          }

          return true;
        },
      },
      {
        name: 'description',
        message: 'Describe the package',
        type: 'input',
        validate: value => !!value,
      },
      {
        name: 'keywords',
        message: 'Provide a comma separated list of keywords',
        type: 'input',
        validate: value => !!value,
        filter: (value: string) =>
          value
            .split(',')
            .map(item => item.trim())
            .filter(item => !!item),
      },
    ]);

    const packagePath = `${packagesDir}/${packageName}`;

    const tasks = new Listr([
      {
        title: 'Creating directory',
        task: () => mkdir(packagePath),
      },
      {
        title: 'Creating files',
        task: async () => {
          const templateDir = await readdir(
            `${import.meta.dirname}/templates`,
            {
              withFileTypes: true,
            },
          );

          const templateTasks = await Promise.all(
            templateDir
              .filter(item => item.isFile())
              .map(async ({ name }) => {
                const file = name.replace(/.js$/, '');
                const content = await import(
                  `${import.meta.dirname}/templates/${name}`
                ).then(module =>
                  module.template({ packageName, description, keywords }),
                );

                return {
                  title: file,
                  task: () => writeFile(`${packagePath}/${file}`, content),
                };
              }),
          );

          return new Listr(templateTasks);
        },
      },
    ]);

    return await tasks.run();
  },
});

if (process.argv[1] === fileURLToPath(import.meta.url)) script.run();
