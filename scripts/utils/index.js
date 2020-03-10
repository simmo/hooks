/* eslint-disable @typescript-eslint/no-var-requires, no-undef */

const fs = require('fs')
const { promisify } = require('util')

exports.readDirAsync = promisify(fs.readdir)

exports.writeFileAsync = promisify(fs.writeFile)

exports.existsFileAsync = promisify(fs.existsSync)
