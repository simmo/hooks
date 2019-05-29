/* eslint-disable @typescript-eslint/no-var-requires */
const { promisify } = require('util')
const glob = promisify(require('glob'))
const readFileAsync = promisify(require('fs').readFile)
const terser = require('terser')
const gzip = require('gzip-size')
const filesize = require('filesize')
const kleur = require('kleur')

const roots = ['cjs', 'esm', 'typings']

roots.map(async root => {
  const files = await glob(root + '/**/*', { nodir: true })
  const contents = await Promise.all(
    files.map(file => readFileAsync(file, 'utf8'))
  )

  const sizes = files.map((file, index) => {
    const content = contents[index]
    const size = Buffer.byteLength(content)

    const minifiedContent = file.endsWith('.js')
      ? terser.minify(contents[index]).code
      : contents[index]

    const minified = Buffer.byteLength(minifiedContent)
    const gzipped = gzip.sync(minifiedContent)

    // console.log(
    //   `\n${kleur.bold(file)}\n${filesize(size)} (Minified: ${filesize(
    //     minified
    //   )}, Gzipped: ${filesize(gzipped)})`
    // )

    return {
      file,
      size,
      minified,
      gzipped,
    }
  })

  const sum = sizes.reduce(
    (acc, { size, minified, gzipped }) => ({
      size: acc.size + size,
      minified: acc.minified + minified,
      gzipped: acc.gzipped + gzipped,
    }),
    { size: 0, minified: 0, gzipped: 0 }
  )

  console.log(
    `${kleur.bold(root)} ${filesize(sum.size)} (Minified: ${filesize(
      sum.minified
    )}, Gzipped: ${filesize(sum.gzipped)})`
  )
})
