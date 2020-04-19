#!/usr/bin/env node

const prettier = require('prettier')
const Listr = require('listr')
const ts = require('typescript')
const {
  createScript,
  writeFileAsync,
  getAllPackages,
  accessFileAsync,
  emptyPromptRetry,
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

const script = createScript({
  name: 'Generate package README',
  task: async () => {
    const choices = await getAllPackages()
    const packages = await emptyPromptRetry(
      [
        {
          name: 'packages',
          message: 'Which packages?',
          type: 'checkbox',
          choices,
        },
      ],
      3
    )

    const tasks = new Listr(
      packages.map(package => ({
        title: package,
        skip: () =>
          // if we have no packages selected we skip the steps entirely (with a truthy value)
          packages.length === 0
            ? 'No packages selected'
            : Promise.resolve(false),
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
                createStory(readme, { name })

                const content = prettier.format(`${readme.join('\n\n')}\n`, {
                  parser: 'markdown',
                })

                return await writeFileAsync(
                  `${packagePath}/README.story.mdx`,
                  content
                )
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
