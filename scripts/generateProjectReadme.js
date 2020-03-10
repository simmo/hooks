#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires, no-undef */

const ts = require('typescript')
const { writeFileAsync, existsFileAsync } = require('./utils')
const cwd = process.cwd()
const pkg = require(`${cwd}/package.json`)
const template = `# ${pkg.name}

${pkg.description}

![NPM version](https://img.shields.io/npm/v/${pkg.name}?style=flat-square)
![Travis](https://img.shields.io/travis/com/simmo/hooks?style=flat-square)
![License](https://img.shields.io/npm/l/${pkg.name}?style=flat-square)

## Install

\`\`\`bash
npm i ${pkg.name}
\`\`\``

const cleanCode = code => {
  return code
    .replace('\n', '')
    .replace(/\s+/g, ' ')
    .replace(', }', ' }')
}

async function run() {
  const file = `${cwd}/index.ts`
  const hasStoryFile = await existsFileAsync(`${cwd}/StoryComponent.tsx`)
  let hookName = ''

  const program = ts.createProgram([file], { allowJs: true })
  // const checker = program.getTypeChecker()
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

        // const symbol = checker.getSymbolAtLocation(node.name)
        // console.log(symbol.valueDeclaration)
        // console.log({
        //   name: symbol.getName(),
        //   documentation: ts.displayPartsToString(
        //     symbol.getDocumentationComment(checker)
        //   ),
        //   type: checker.typeToString(
        //     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        //     checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration)
        //   ),
        // })

        hasExport = true

        readme.push(`### ${node.name.text}`)
        hookName = node.name.text

        const jsDocParamComments = node.jsDoc
          ? node.jsDoc.reduce(
              (obj, doc) => {
                if (doc.tags.length) {
                  doc.tags.forEach(tag => {
                    if (ts.isJSDocParameterTag(tag)) {
                      // console.log(tag)
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

        const returnType = node.type ? `: ${node.type.getText(sourceFile)}` : ''

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

          console.log(node.declarationList)

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

        if (hasStoryFile) {
          readme.push(`
import { Meta, Story, Preview, Props } from '@storybook/addon-docs/blocks'
import StoryComponent from './StoryComponent'

<Meta title="${hookName}" component={StoryComponent} />

## Example
<Preview>
  <Story name="Usage">
    <StoryComponent />
  </Story>
</Preview>
          `)
        }
      }
    }
  })

  await writeFileAsync(
    `${cwd}/README${hasStoryFile ? '.story.mdx' : '.md'}`,
    `${readme.join('\n\n')}\n`
  )
}

run()
