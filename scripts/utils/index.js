/* eslint-disable @typescript-eslint/no-var-requires, no-undef */

const fs = require('fs')
const { promisify } = require('util')
const chalk = require('chalk')
const { prompt } = require('inquirer')

const readDirAsync = promisify(fs.readdir)
const writeFileAsync = promisify(fs.writeFile)
const readFileAsync = promisify(fs.readFile)
const accessFileAsync = promisify(fs.access)

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
exports.accessFileAsync = accessFileAsync
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

exports.emptyPromptRetry = async (promptArg, times = 2) => {
  let results = []
  const [firstElement, ...otherElements] = promptArg
  const { name: passedName } = firstElement

  for (let i = 0; i <= times - 1; i++) {
    if (results.length === 0) {
      const selection = await prompt([
        {
          ...firstElement,
          message:
            i !== 0
              ? `Seems like you haven't selected an option, please select one. ${firstElement.message}`
              : firstElement.message,
        },
        ...otherElements,
      ])

      results = selection[passedName]
    }
  }

  return Promise.resolve(results)
}
