import prettier from 'prettier';
import inquirer from 'inquirer';
import Listr from 'listr';
import ts from 'typescript';
import { red } from 'yoctocolors';
import { createScript, getAllPackages, isString } from '../../utils/index.js';
import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
const cwd = process.cwd();

interface ErrorInfo {
  packageName: string;
  step: string;
  cause: unknown;
}

interface JsDocParamComments {
  parameters: Record<string, string>;
  return: string | null;
}

interface ExportedFunctionData {
  exportName: string;
  signature: string;
  parameters: Array<{
    name: string;
    type: string;
    comment: string | null;
  }>;
  returnType: string;
  returnComment: string | null;
}

const formatJsDocComment = (
  comment: string | ts.NodeArray<ts.JSDocComment> | undefined,
): string | null => {
  if (isString(comment)) return comment.trim();

  if (!comment) return null;

  const text = comment
    .map(part => (isString(part) ? part : part.text))
    .join('')
    .trim();

  return text.length > 0 ? text : null;
};

const getJsDocParamComments = (
  node: ts.Node,
  sourceFile: ts.SourceFile,
): JsDocParamComments =>
  ts.getJSDocTags(node).reduce(
    (obj: JsDocParamComments, tag: ts.JSDocTag) => {
      if (ts.isJSDocParameterTag(tag)) {
        obj.parameters[tag.name.getText(sourceFile)] =
          formatJsDocComment(tag.comment) ?? '';
      }

      if (ts.isJSDocReturnTag(tag)) {
        obj.return = formatJsDocComment(tag.comment);
      }

      return obj;
    },
    { parameters: {}, return: null },
  );

const getParameterComment = (
  parameterName: string,
  comments: JsDocParamComments,
): string | null => {
  const exactComment = comments.parameters[parameterName];

  if (exactComment) return exactComment;

  const nestedComments = Object.entries(comments.parameters)
    .filter(([name]) => name.startsWith(`${parameterName}.`))
    .map(([name, comment]) => `- \`${name}\`: ${comment}`);

  return nestedComments.length > 0 ? nestedComments.join('\n') : null;
};

const getExportedFunctions = (
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
): ExportedFunctionData[] => {
  const exportedFunctions: ExportedFunctionData[] = [];

  const collectFunction = ({
    declaration,
    exportName,
    jsDocNode,
  }: {
    declaration: ts.SignatureDeclaration;
    exportName: string;
    jsDocNode: ts.Node;
  }) => {
    const signature = checker.getSignatureFromDeclaration(declaration);

    if (!signature) return;

    const signatureText = checker.signatureToString(
      signature,
      declaration,
      ts.TypeFormatFlags.NoTruncation,
    );

    const jsDocComments = getJsDocParamComments(jsDocNode, sourceFile);
    const returnType = checker.typeToString(
      checker.getReturnTypeOfSignature(signature),
      declaration,
      ts.TypeFormatFlags.NoTruncation,
    );

    const parameters = declaration.parameters.map(param => {
      const parameterName = param.name.getText(sourceFile);
      const isOptional = !!param.questionToken || !!param.initializer;
      const isRest = !!param.dotDotDotToken;

      return {
        name: `${isRest ? '...' : ''}${parameterName}${isOptional ? '?' : ''}`,
        type:
          param.type?.getText(sourceFile) ??
          checker.typeToString(
            checker.getTypeAtLocation(param),
            param,
            ts.TypeFormatFlags.NoTruncation,
          ),
        comment: getParameterComment(parameterName, jsDocComments),
      };
    });

    exportedFunctions.push({
      exportName,
      signature: `${exportName}${signatureText}`,
      parameters,
      returnType,
      returnComment: jsDocComments.return,
    });
  };

  ts.forEachChild(sourceFile, node => {
    if (ts.isFunctionDeclaration(node)) {
      const isExport = node.modifiers?.find(
        modifier => modifier.kind === ts.SyntaxKind.ExportKeyword,
      );

      if (!isExport) {
        return;
      }

      collectFunction({
        declaration: node,
        exportName: node.name?.text ?? 'default',
        jsDocNode: node,
      });

      return;
    }

    if (ts.isVariableStatement(node)) {
      const isExport = node.modifiers?.find(
        modifier => modifier.kind === ts.SyntaxKind.ExportKeyword,
      );

      if (!isExport) {
        return;
      }

      node.declarationList.declarations.forEach(declaration => {
        const initializer = declaration.initializer;

        if (
          !initializer ||
          (!ts.isArrowFunction(initializer) &&
            !ts.isFunctionExpression(initializer))
        ) {
          return;
        }

        collectFunction({
          declaration: initializer,
          exportName: declaration.name.getText(sourceFile),
          jsDocNode: node,
        });
      });
    }
  });

  return exportedFunctions;
};

const createReadme = ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => [
  `# 🎒 ${name}

${description}

![NPM version](https://img.shields.io/npm/v/${name}?style=flat-square)
![License](https://img.shields.io/npm/l/${name}?style=flat-square)

## Install

\`\`\`bash
npm i ${name}
\`\`\``,
];

const generatePackagesScript = (
  packages: string[],
  collectError: (error: ErrorInfo) => void = () => {},
) => {
  return packages.map(packageName => ({
    title: packageName,
    task: async () => {
      const packagePath = `${cwd}/packages/${packageName}`;
      const { name, description } = await import(`${packagePath}/package.json`);
      const readme = createReadme({ name, description });

      return new Listr([
        {
          title: 'Process TypeScript',
          task: () => {
            const file = `${packagePath}/index.ts`;
            const program = ts.createProgram([file], { allowJs: true });
            const sourceFile = program.getSourceFile(file);
            const checker = program.getTypeChecker();

            if (!sourceFile) {
              throw new Error(
                `Could not find source file for package ${packageName}`,
              );
            }

            const exportedFunctions = getExportedFunctions(sourceFile, checker);

            if (!exportedFunctions.length) return;

            readme.push('## Usage');

            exportedFunctions.forEach(exportedFunction => {
              readme.push(`### ${exportedFunction.exportName}`);
              readme.push(`\`\`\`ts\n${exportedFunction.signature}\n\`\`\``);

              if (exportedFunction.parameters.length) {
                readme.push('#### Parameters');

                exportedFunction.parameters.forEach(param => {
                  readme.push(`##### \`${param.name}: ${param.type}\``);

                  if (param.comment) {
                    readme.push(param.comment);
                  }
                });
              }

              readme.push(`#### Return \`${exportedFunction.returnType}\``);
              if (exportedFunction.returnComment) {
                readme.push(exportedFunction.returnComment);
              }
            });
          },
        },
        {
          title: 'Save',
          task: async () => {
            try {
              const content = await prettier.format(
                `${readme.join('\n\n')}\n`,
                {
                  parser: 'markdown',
                },
              );

              return await writeFile(`${packagePath}/README.md`, content);
            } catch (error) {
              collectError({ packageName, step: 'Save', cause: error });
              // we throw the error again to make sure that Listr shows the failed step in the console
              throw error;
            }
          },
        },
      ]);
    },
  }));
};

export const script = createScript({
  name: 'Generate package README',
  task: async () => {
    const errors: ErrorInfo[] = [];
    const choices = await getAllPackages();
    const { packages } = await inquirer.prompt<{
      packages: string[];
    }>([
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
    ]);

    const tasks = new Listr(
      generatePackagesScript(packages, error => errors.push(error)),
      {
        concurrent: true,
        exitOnError: false,
      },
    );

    try {
      await tasks.run();
    } catch (error) {
      if (errors.length > 0) {
        const message =
          'The following packages could not be built:' +
          errors.reduce(
            (agg, error, i) =>
              `${agg} ${red(error.packageName)}${
                i === errors.length - 1 ? '.' : ','
              }`,
            '',
          ) +
          '\nSelect any packages you want to retry.';

        const { retryPackages } = await inquirer.prompt<{
          retryPackages: string[];
        }>([
          {
            name: 'retryPackages',
            message,
            type: 'checkbox',
            choices: errors.map(error => error.packageName),
          },
        ]);

        const errorTasks = new Listr(
          // we will log the errors to the console for this second attempt
          generatePackagesScript(retryPackages, error =>
            console.log(`${error.packageName}:`, error.cause),
          ),
          {
            concurrent: 2,
            exitOnError: false,
          },
        );

        return await errorTasks.run();
      }
    }
  },
});

if (process.argv[1] === fileURLToPath(import.meta.url)) script.run();
