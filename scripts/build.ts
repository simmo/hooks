import ora from 'ora';
import { exec } from 'child_process';
import { promisify } from 'util';

const cwd = process.cwd();
const pkg = await import(`${cwd}/package.json`);
const execAsync = promisify(exec);

const spinner = ora('Building...').start();

spinner.info(pkg.name);

spinner.start('Cleaning');
await execAsync('rm -rf ./cjs && rm -rf ./esm && rm -rf ./typings');
spinner.succeed();

spinner.start('Building CommonJS');
await execAsync(
  'tsc -m commonjs --outDir cjs --declaration --declarationDir typings',
  { cwd },
).catch(e => console.error(e));
spinner.succeed();

spinner.start('Building ES modules');
await execAsync('tsc -m esNext --outDir esm');
spinner.succeed();
