import ora from 'ora';
import { spawn } from 'child_process';
import { rm, writeFile } from 'fs/promises';

const cwd = process.cwd();
const pkg = await import(`${cwd}/package.json`);

const spinner = ora('Typechecking...').start();
spinner.info(pkg.name);

const tsconfigPath = './.tsconfig.typecheck.tmp.json';

await writeFile(
  tsconfigPath,
  JSON.stringify(
    {
      extends: '../../tsconfig.json',
      include: ['./**/*.ts', './**/*.tsx'],
      exclude: [
        './**/*.test.ts',
        './**/*.test.tsx',
        './dist',
        './node_modules',
      ],
    },
    null,
    2,
  ) + '\n',
);

spinner.start('Running TypeScript typecheck');

try {
  await new Promise<void>((resolve, reject) => {
    const child = spawn('tsc', ['--noEmit', '-p', tsconfigPath], {
      cwd,
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', code => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Typecheck failed with exit code ${code ?? 'unknown'}`));
    });
  });
} finally {
  await rm(tsconfigPath, { force: true });
}

spinner.succeed();
