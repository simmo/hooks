/* eslint-disable @typescript-eslint/no-var-requires, no-undef */
const fs = require('fs')
const ora = require('ora')
const { promisify } = require('util')
const { exec } = require('child_process')

const cwd = process.cwd()
const pkg = require(`${cwd}/package.json`)
const execAsync = promisify(exec)

async function run() {
  const spinner = ora('Building...').start()

  spinner.info(pkg.name)

  spinner.start('Cleaning')
  await execAsync('rm -rf ./cjs && rm -rf ./esm && rm -rf ./typings')
  spinner.succeed()

  spinner.start('Building CommonJS')
  await execAsync(
    'tsc -m commonjs --outDir cjs --declaration --declarationDir typings',
    { cwd }
  ).catch(e => console.error(e))
  spinner.succeed()

  spinner.start('Building ES modules')
  await execAsync('tsc -m esNext --outDir esm')
  spinner.succeed()
}

run()
