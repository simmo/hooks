#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires, no-undef */

const ts = require('typescript')
const { writeFileAsync } = require('./utils')
const cwd = process.cwd()
const pkg = require(`${cwd}/package.json`)
const [scope, name] = pkg.name.split()
const template = `# ${pkg.name}

${pkg.description}

![npm](https://img.shields.io/npm/v/${scope.replace(
  '@',
  ''
)}/${name}?style=flat-square)

## Install

\`\`\`bash
npm i ${pkg.name}
\`\`\``

async function run() {
  const file = `${cwd}/index.ts`
  const program = ts.createProgram([file], { allowJs: true })
  const sourceFile = program.getSourceFile(file)
  let hasExport = false

  const readme = [template]

  ts.forEachChild(sourceFile, node => {
    if (ts.isFunctionDeclaration(node)) {
      const isExport = node.modifiers.find(
        modifier => modifier.kind === ts.SyntaxKind.ExportKeyword
      )

      if (isExport) {
        if (!hasExport) {
          readme.push('## Usage')
        }

        hasExport = true

        readme.push(`### ${node.name.text}`)

        const jsDocParamComments = node.jsDoc
          ? node.jsDoc.reduce((obj, doc) => {
              doc.tags.forEach(tag => {
                obj[tag.name.text] = tag.comment
              })

              return obj
            }, {})
          : {}

        const returnType = node.type.getText(sourceFile)

        readme.push(
          `\`\`\`ts\n${node.name.text}(${node.parameters
            .map(param => param.getText(sourceFile))
            .join(', ')})${returnType ? `: ${returnType}` : ''}\n\`\`\``
        )

        if (node.parameters.length) {
          readme.push(`**Parameters**`)
          node.parameters.forEach(param => {
            readme.push(`#### \`${param.getText(sourceFile)}\``)

            const jsDocParamComment = jsDocParamComments[param.name.text]

            if (jsDocParamComment) {
              readme.push(jsDocParamComment)
            }
          })
        }
      }
    }
  })

  await writeFileAsync(`${cwd}/README.md`, `${readme.join('\n\n')}\n`)
}

run()
