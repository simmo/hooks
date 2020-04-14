#!/usr/bin/env node

const { prompt } = require('inquirer')
const fs = require('fs')
const Listr = require('listr')
const { createScript, readDirAsync, writeFileAsync } = require('../../utils')

const script = createScript({
  name: 'Create new package',
  task: async () => {
    const packagesDir = './packages'
    const validatePackageName = /^[a-z-?]+$/g
    const existingPackages = await readDirAsync(packagesDir, {
      withFileTypes: true,
    })
    const existingPackageNames = existingPackages
      .filter(item => item.isDirectory())
      .map(({ name }) => name)

    const { package, description, keywords } = await prompt([
      {
        name: 'package',
        message: 'What should the package be called?',
        validate: value => {
          if (existingPackageNames.includes(value)) {
            return `Package '${value}' already exists, try another name.`
          }

          if (!validatePackageName.test(value)) {
            return 'Should not contain spaces or special characters'
          }

          return true
        },
      },
      {
        name: 'description',
        message: 'Describe the package',
        validate: value => !!value,
      },
      {
        name: 'keywords',
        message: 'Provide a comma separated list of keywords',
        validate: value => !!value,
        filter: value =>
          value
            .split(',')
            .map(item => item.trim())
            .filter(item => !!item),
      },
    ])

    const packagePath = `${packagesDir}/${package}`

    const tasks = new Listr([
      {
        title: 'Creating directory',
        task: () => fs.mkdirSync(packagePath),
      },
      {
        title: 'Creating files',
        task: async () => {
          const templateDir = await readDirAsync(`${__dirname}/template`, {
            withFileTypes: true,
          })

          const templateTasks = templateDir
            .filter(item => item.isFile())
            .map(({ name }) => {
              const file = name.replace(/.js$/, '')
              const content = require(`${__dirname}/template/${name}`)({
                package,
                description,
                keywords,
              })

              return {
                title: file,
                task: () => {
                  writeFileAsync(`${packagePath}/${file}`, content)
                },
              }
            })

          return new Listr(templateTasks)
        },
      },
    ])

    return await tasks.run()
  },
})

require.main === module && script.run()

module.exports = script
