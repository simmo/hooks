import ora from 'ora';
import { exec } from 'child_process';
import { promisify } from 'util';
import { type InputOptions, type OutputOptions, rolldown } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';

const cwd = process.cwd();
const pkg = await import(`${cwd}/package.json`);
const execAsync = promisify(exec);

const external: string[] = [
  ...Object.keys(pkg.peerDependencies ?? {}),
  ...Object.keys(pkg.dependencies ?? {}),
];

const spinner = ora('Building...').start();

spinner.info(pkg.name);

spinner.start('Cleaning');
await execAsync('rm -rf ./dist');
spinner.succeed();

const tsconfigPath = new URL('../tsconfig.build.json', import.meta.url)
  .pathname;
const baseBuildOptions: InputOptions = {
  input: 'index.ts',
  cwd,
  external,
  experimental: { attachDebugInfo: 'none' },
};
const baseOutputOptions: OutputOptions = {
  dir: 'dist',
  preserveModules: true,
  preserveModulesRoot: '.',
};

const jsBuild = await rolldown(baseBuildOptions);

spinner.start('Building CommonJS');
await jsBuild.write({
  ...baseOutputOptions,
  format: 'cjs',
  entryFileNames: '[name].cjs',
  chunkFileNames: '[name]-[hash].cjs',
});
spinner.succeed();

spinner.start('Building ES modules');
await jsBuild.write({
  ...baseOutputOptions,
  format: 'esm',
  entryFileNames: '[name].js',
  chunkFileNames: '[name]-[hash].js',
});
spinner.succeed();

spinner.start('Generating type definitions');
const dtsBuild = await rolldown({
  ...baseBuildOptions,
  plugins: [dts({ tsconfig: tsconfigPath, emitDtsOnly: true })],
});
await dtsBuild.write({ ...baseOutputOptions, format: 'esm' });
spinner.succeed();
