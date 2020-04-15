/* eslint-disable @typescript-eslint/no-var-requires, no-undef */

const fs = require('fs')
const { promisify } = require('util')
const chalk = require('chalk')

const readDirAsync = promisify(fs.readdir)
const writeFileAsync = promisify(fs.writeFile)
const readFileAsync = promisify(fs.readFile)
const existsFileAsync = promisify(fs.exists)
const header = title => {
  console.clear()

  console.log(
    `🎒 ${chalk.bold('Hook Kit')} ${
      title ? `${chalk.dim('>')} ${title}` : ''
    }\n`
  )
}

exports.readDirAsync = readDirAsync
exports.writeFileAsync = writeFileAsync
exports.readFileAsync = readFileAsync
exports.existsFileAsync = existsFileAsync
exports.header = header

exports.getAllPackages = async () => {
  const packages = await readDirAsync('./packages', {
    withFileTypes: true,
  })

  return packages.filter(item => item.isDirectory()).map(({ name }) => name)
}

exports.createScript = ({ name, task }) => ({
  name,
  run: async () => {
    header(name)

    await task()

    console.log('')
  },
})
