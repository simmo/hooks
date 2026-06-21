import ora from 'ora';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { type InputOptions, type OutputOptions, rolldown } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';
import { join, resolve } from 'node:path';
import { glob, readFile } from 'node:fs/promises';
import { minify } from 'terser';
import { gzipSize } from 'gzip-size';
import { filesize } from 'filesize';
import { isString } from './utils/index.js';
import * as core from '@actions/core';
import { env } from 'node:process';

// const cwd = process.cwd();
// const pkg = await import(`${cwd}/package.json`);
// const execAsync = promisify(exec);

// const external: string[] = [
//   ...Object.keys(pkg.peerDependencies ?? {}),
//   ...Object.keys(pkg.dependencies ?? {}),
// ];

const spinner = ora('Building...').start();

// spinner.info(pkg.name);

// spinner.start('Cleaning');
// await execAsync('rm -rf ./dist');
// spinner.succeed();

// const tsconfigPath = new URL('../tsconfig.build.json', import.meta.url)
//   .pathname;
// const baseBuildOptions: InputOptions = {
//   input: 'index.ts',
//   cwd,
//   external,
//   experimental: { attachDebugInfo: 'none' },
// };
// const baseOutputOptions: OutputOptions = {
//   dir: 'dist',
//   preserveModules: true,
//   preserveModulesRoot: '.',
// };

// const jsBuild = await rolldown(baseBuildOptions);

// spinner.start('Building CommonJS');
// await jsBuild.write({
//   ...baseOutputOptions,
//   format: 'cjs',
//   entryFileNames: '[name].cjs',
//   chunkFileNames: '[name]-[hash].cjs',
// });
// spinner.succeed();

// spinner.start('Building ES modules');
// await jsBuild.write({
//   ...baseOutputOptions,
//   format: 'esm',
//   entryFileNames: '[name].js',
//   chunkFileNames: '[name]-[hash].js',
// });
// spinner.succeed();

// spinner.start('Generating type definitions');
// const dtsBuild = await rolldown({
//   ...baseBuildOptions,
//   plugins: [dts({ tsconfig: tsconfigPath, emitDtsOnly: true })],
// });
// await dtsBuild.write({ ...baseOutputOptions, format: 'esm' });
// spinner.succeed();

spinner.start('Reporting build sizes');

const files: { path: string; name: string }[] = [];

for await (const file of glob(join('.', 'dist', '**', '*'), {
  withFileTypes: true,
})) {
  if (file.isFile())
    files.push({ path: join(file.parentPath, file.name), name: file.name });
}

const results = await Promise.all(
  files.map(async file => {
    const content = await readFile(file.path, 'utf8');
    const size = filesize(Buffer.byteLength(content));

    const minified =
      file.name.endsWith('.js') || file.name.endsWith('.cjs')
        ? await minify(content).then(({ code }) =>
            isString(code) ? filesize(Buffer.byteLength(code)) : undefined,
          )
        : undefined;

    const gzipped = await gzipSize(minified ?? content).then(filesize);

    return {
      file,
      size,
      minified,
      gzipped,
    };
  }),
);

results.sort(({ file: a }, { file: b }) => a.path.localeCompare(b.path));

if (env['GITHUB_ACTIONS'] !== 'true') {
  console.log(results);
} else {
  core.summary.addHeading('Build Report', 1);

  results.forEach(({ file, size, minified, gzipped }) => {
    core.summary.addHeading(file.name, 2).addTable([
      [
        { data: 'Size', header: true },
        { data: 'Minified', header: true },
        { data: 'Gzipped', header: true },
      ],
      [{ data: size }, { data: minified ?? '-' }, { data: gzipped }],
    ]);
  });

  await core.summary.write();
}

spinner.succeed();
