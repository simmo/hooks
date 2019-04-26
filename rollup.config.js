import typescript from 'rollup-plugin-typescript'
import filesize from 'rollup-plugin-filesize'
import kleur from 'kleur'

export default {
  input: './index.ts',
  output: [
    { file: 'dist/index.js', format: 'cjs' },
    { file: 'dist/index.es.js', format: 'esm' },
  ],
  external: id => !id.startsWith('.') && !id.startsWith('/'),
  plugins: [
    typescript(),
    filesize({
      render: (
        options,
        { file, format },
        { minSize, gzipSize, bundleSize }
      ) => {
        return `\n${kleur.bold(
          `${file} (${format})`
        )}\n${bundleSize} (Minified: ${minSize}, Gzipped: ${gzipSize})`
      },
    }),
  ],
}
