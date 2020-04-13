#!/usr/bin/env node

const { prompt } = require('inquirer')
const { header, readDirAsync } = require('./utils')

async function run() {
  header()

  const tasks = await readDirAsync(`${__dirname}/tasks`, {
    withFileTypes: true,
  })

  const choices = tasks.map(({ name: dir }) => {
    const task = require(`./tasks/${dir}`)

    return { name: task.name, value: task.run }
  })

  const { script } = await prompt([
    {
      name: 'script',
      message: 'What would you like to do?',
      type: 'list',
      choices,
    },
  ])

  await script()
}

run()
