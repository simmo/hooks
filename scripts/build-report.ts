import { glob, readFile } from 'fs/promises';

import { minify } from 'terser';
import { gzipSize } from 'gzip-size';
import { filesize } from 'filesize';
import { bold } from 'yoctocolors';

const roots = ['cjs', 'esm', 'typings'];

roots.map(async root => {
  const files: string[] = [];

  for await (const entry of glob(root + '/**/*', { withFileTypes: true })) {
    if (entry.isFile()) files.push(entry.name);
  }

  const contents = await Promise.all(files.map(file => readFile(file, 'utf8')));

  const sizes = await Promise.all(
    files.map(async (file, index) => {
      const content = contents[index];
      const size = Buffer.byteLength(content);

      const minifiedContent = file.endsWith('.js')
        ? (await minify(contents[index])).code
        : contents[index];

      if (!minifiedContent) throw new Error(`Failed to minify ${file}`);

      const minified = Buffer.byteLength(minifiedContent);
      const gzipped = await gzipSize(minifiedContent);

      console.log(
        `\n${bold(file)}\n${filesize(size)} (Minified: ${filesize(
          minified,
        )}, Gzipped: ${filesize(gzipped)})`,
      );

      return {
        file,
        size,
        minified,
        gzipped,
      };
    }),
  );

  const sum = sizes.reduce(
    (acc, { size, minified, gzipped }) => ({
      size: acc.size + size,
      minified: acc.minified + minified,
      gzipped: acc.gzipped + gzipped,
    }),
    { size: 0, minified: 0, gzipped: 0 },
  );

  console.log(
    `${bold(root)} ${filesize(sum.size)} (Minified: ${filesize(
      sum.minified,
    )}, Gzipped: ${filesize(sum.gzipped)})`,
  );
});
