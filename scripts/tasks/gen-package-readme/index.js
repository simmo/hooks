#!/usr/bin/env node

const prettier = require('prettier')
const { prompt } = require('inquirer')
const Listr = require('listr')
const ts = require('typescript')
const chalk = require('chalk')
const {
  createScript,
  writeFileAsync,
  getAllPackages,
  accessFileAsync,
} = require('../../utils')
const cwd = process.cwd()

const createStory = (readme, { name }) => {
  readme.push(`
import { Meta, Story, Preview, Props } from '@storybook/addon-docs/blocks'
import StoryComponent from './StoryComponent'

<Meta title="${name}" component={StoryComponent} />

## Example
<Preview>
  <Story name="Usage">
    <StoryComponent />
  </Story>
</Preview>
  `)
}

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

const generatePackagesScript = (packages, collectError = () => {}) => packages.map(package => ({
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
          try {
            const content = prettier.format(`${readme.join('\n\n')}\n`, {
              parser: 'markdown',
            })

            return await writeFileAsync(`${packagePath}/README.md`, content)
          } catch(e) {
            collectError({ package, step: 'Save', verbose: e })
            // we throw the error again to make sure that Listr shows the failed step in the console
            throw new Error(e)
          }
        },
      },
      {
        title: 'Generate story file',
        skip: async () => {
          try {
            await accessFileAsync(`${packagePath}/StoryComponent.tsx`)

            // to execute the step we need to return a falsy value
            return false
          } catch (e) {
            // if accessFileAsync errors there is no file, so we can skip the step
            // to skip it we need to return a truthy value
            return 'No story component, skipping story file'
          }
        },
        task: async () => {
          try {
            createStory(readme, { name })

            const content = prettier.format(`${readme.join('\n\n')}\n`, {
              parser: 'markdown',
            })

            return await writeFileAsync(
              `${packagePath}/README.story.mdx`,
              content
            )
          } catch(e) {
            collectError({ package, step: 'Generate story file', verbose: e })
            // we throw the error again to make sure that Listr shows the failed step in the console
            throw new Error(e)
          }
        },
      },
    ])
  },
}))

const script = createScript({
  name: 'Generate package README',
  task: async () => {
    const errors = []
    const choices = await getAllPackages()
    const { packages } = await prompt([
      {
        name: 'packages',
        message: 'Which packages?',
        type: 'checkbox',
        validate: choice =>
          choice.length === 0
            ? "It seems like you haven't selected an option, please select one"
            : true,
        choices,
      },
    ])

    const tasks = new Listr(
      generatePackagesScript(packages, (e) => errors.push(e)),
      {
        concurrent: 2,
        exitOnError: false
      }
    )

    try {
      await tasks.run();
    } catch(e) {
      if (errors.length > 0) {
        const message =
          'The following packages could not be built:' +
          errors.reduce(
            (agg, error, i) =>
              `${agg} ${chalk.red(error.package)}${i === errors.length - 1 ? '.' : ','}`, ''
          ) +
          '\nSelect any packages you want to retry.'

        const { retryPackages } = await prompt([
          {
            name: 'retryPackages',
            message,
            type: 'checkbox',
            choices: errors.map(error => error.package),
          },
        ])

        const errorTasks = await new Listr(
          // we will log the errors to the console for this second attempt
          generatePackagesScript(retryPackages, error => console.log(
            `${error.package}:`, error.verbose
          )),
          {
            concurrent: 2,
            exitOnError: false,
          }
        )

        return await errorTasks.run()
      }
    }
  },
})

require.main === module && script.run()

module.exports = script
