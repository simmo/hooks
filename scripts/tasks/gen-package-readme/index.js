#!/usr/bin/env node

const { prompt } = require('inquirer')
const prettier = require('prettier')
const Listr = require('listr')
const ts = require('typescript')
const { createScript, writeFileAsync, getAllPackages } = require('../../utils')
const cwd = process.cwd()
const createReadme = ({ name, description }) => [
  `# 🎒 ${name}

${description}

![NPM version](https://img.shields.io/npm/v/${name}?style=flat-square)
![Travis](https://img.shields.io/travis/com/simmo/hooks?style=flat-square)
![License](https://img.shields.io/npm/l/${name}?style=flat-square)

## Install

\`\`\`bash
npm i ${name}
\`\`\``,
]

const script = createScript({
  name: 'Generate package README',
  task: async () => {
    const choices = await getAllPackages()
    const { packages } = await prompt([
      {
        name: 'packages',
        message: 'Which packages?',
        type: 'checkbox',
        choices,
      },
    ])

    const tasks = new Listr(
      packages.map(package => ({
        title: package,
        task: () => {
          const packagePath = `${cwd}/packages/${package}`
          const { name, description } = require(`${packagePath}/package.json`)
          const readme = createReadme({ name, description })

          return new Listr([
            {
              title: 'Process TypeScript',
              task: () => {
                const file = `${packagePath}/index.ts`
                const program = ts.createProgram([file], { allowJs: true })
                // const checker = program.getTypeChecker()
                const sourceFile = program.getSourceFile(file)
                let hasExport = false

                ts.forEachChild(sourceFile, node => {
                  if (ts.isFunctionDeclaration(node)) {
                    const isExport = node.modifiers.find(
                      modifier => modifier.kind === ts.SyntaxKind.ExportKeyword
                    )

                    if (isExport) {
                      if (!hasExport) {
                        readme.push('## Usage')
                      }

                      // const symbol = checker.getSymbolAtLocation(node.name)
                      // console.log(symbol.valueDeclaration)
                      // console.log({
                      //   name: symbol.getName(),
                      //   documentation: ts.displayPartsToString(
                      //     symbol.getDocumentationComment(checker)
                      //   ),
                      //   type: checker.typeToString(
                      //     checker.getTypeOfSymbolAtLocation(
                      //       symbol,
                      //       symbol.valueDeclaration
                      //     )
                      //   ),
                      // })

                      hasExport = true

                      readme.push(`### ${node.name.text}`)

                      const jsDocParamComments = node.jsDoc
                        ? node.jsDoc.reduce(
                            (obj, doc) => {
                              if (doc.tags.length) {
                                doc.tags.forEach(tag => {
                                  if (ts.isJSDocParameterTag(tag)) {
                                    obj.parameters[tag.name.text] = tag.comment
                                  }

                                  if (ts.isJSDocReturnTag(tag)) {
                                    obj.return = tag.comment
                                  }
                                })
                              }

                              return obj
                            },
                            { parameters: {}, return: null }
                          )
                        : { parameters: {}, return: null }

                      const returnType = node.type
                        ? `: ${node.type.getText(sourceFile)}`
                        : ''

                      readme.push(
                        `\`\`\`ts\n${node.name.text}(${
                          node.parameters.length
                            ? node.parameters
                                .map(param => param.getText(sourceFile))
                                .join(', ')
                            : ''
                        })${returnType}\n\`\`\``
                      )

                      if (node.parameters.length) {
                        readme.push(`#### Parameters`)

                        // console.log(node.declarationList)

                        node.parameters.forEach(param => {
                          readme.push(`##### \`${param.getText(sourceFile)}\``)

                          // console.log(JSON.stringify(param, null, 2))

                          // if (ts.isTypeReferenceNode(param.type)) {
                          //   console.log(param.declarationList)
                          // }

                          const jsDocParamComment =
                            jsDocParamComments.parameters[param.name.text]

                          if (jsDocParamComment) {
                            readme.push(jsDocParamComment)
                          }
                        })
                      }

                      if (jsDocParamComments.return) {
                        readme.push(`#### Return`)
                        readme.push(jsDocParamComments.return)
                      }
                    }
                  }
                })
              },
            },
            {
              title: 'Save',
              task: async () => {
                const content = prettier.format(`${readme.join('\n\n')}\n`, {
                  parser: 'markdown',
                })

                return await writeFileAsync(`${packagePath}/README.md`, content)
              },
            },
          ])
        },
      })),
      { concurrent: 2, exitOnError: false }
    )

    return await tasks.run()
  },
})

require.main === module && script.run()

module.exports = script
